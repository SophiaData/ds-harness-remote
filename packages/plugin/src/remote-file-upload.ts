import { workspaceUploadMaxBytes } from './workspace-transfer-limits.js'
import { constants } from 'node:fs'
import { open } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import type { RemoteClientCore } from '@dsh-remote/client-core'
import { z } from 'zod'

const CHUNK = 64 * 1024

/** Reuses the dedicated connection-owned uploader, never a filesystem RPC. */
export async function uploadRemoteFile(client: Pick<RemoteClientCore, 'rpc'> & Partial<Pick<RemoteClientCore, 'getStats'>>, sessionId: string,
  localPath: string, name: string, signal: AbortSignal, assertCurrent: () => void) {
  const file = await open(localPath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0))
  const uploadId = randomUUID()
  const scope = { sessionId, uploadId }
  let committing = false
  let totalBytes = 0
  const check = () => {
    signal.throwIfAborted(); assertCurrent()
    if (totalBytes > workspaceUploadMaxBytes(client.getStats?.().mode)) throw new Error('UPLOAD_TRANSPORT_LIMIT')
  }
  const call = async (method: string, params: object) => {
    check()
    const result = await client.rpc(method, params, signal)
    check()
    return result
  }
  try {
    check()
    const before = await file.stat()
    totalBytes = before.size
    if (!before.isFile() || before.size > workspaceUploadMaxBytes(client.getStats?.().mode)) throw new Error('INVALID_LOCAL_UPLOAD_FILE')
    const opened = z.object({ uploadId: z.literal(uploadId), chunkBytes: z.number().int().min(1).max(CHUNK) })
      .parse(await call('workspace.upload.open', { ...scope, name, totalBytes: before.size }))
    let offset = 0
    while (offset < before.size) {
      check()
      const buffer = Buffer.alloc(Math.min(opened.chunkBytes, before.size - offset))
      const read = await file.read(buffer, 0, buffer.length, offset)
      if (!read.bytesRead) throw new Error('LOCAL_UPLOAD_FILE_CHANGED')
      const next = offset + read.bytesRead
      z.object({ uploadId: z.literal(uploadId), receivedBytes: z.literal(next) }).parse(
        await call('workspace.upload.chunk', { ...scope, offset, data: buffer.subarray(0, read.bytesRead).toString('base64') }))
      offset = next
    }
    const after = await file.stat()
    if (after.size !== before.size || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs) throw new Error('LOCAL_UPLOAD_FILE_CHANGED')
    check()
    committing = true
    const result = z.object({ name: z.string().min(1), path: z.string().min(1), bytes: z.literal(before.size) })
      .parse(await call('workspace.upload.commit', scope))
    return { status: 'accepted' as const, ...result }
  } catch {
    // Abort can remove only uncommitted temporary data, never a published file.
    await client.rpc('workspace.upload.abort', scope, AbortSignal.timeout(5_000)).catch(() => undefined)
    return { status: committing ? 'unknown' as const : 'rejected' as const }
  } finally { await file.close() }
}
