import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageJsonPath = join(root, 'package.json')
const versionPath = join(root, 'src', 'version.ts')

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const packageVersion = packageJson.version
if (typeof packageVersion !== 'string') {
  throw new Error('package.json must contain a string "version".')
}

const source = readFileSync(versionPath, 'utf8')
const match = source.match(/export const PLUGIN_VERSION\s*=\s*['"]([^'"]+)['"]/)
if (!match) {
  throw new Error('Cannot find PLUGIN_VERSION declaration in src/version.ts.')
}

const pluginVersion = match[1]
if (packageVersion !== pluginVersion) {
  throw new Error(
    `Version mismatch: package.json version is ${packageVersion}, but PLUGIN_VERSION is ${pluginVersion}. ` +
      'Keep these two versions in sync.'
  )
}

// The self-hosted Server's landing page repeats the installable plugin version.
// Keep it bound to package.json so a bump cannot leave the served page stale.
const webHomePagePath = join(root, '..', '..', 'apps', 'server', 'web', 'src', 'HomePage.tsx')
const webHomePage = readFileSync(webHomePagePath, 'utf8')
const referencedVersions = [...webHomePage.matchAll(/ds-harness-remote@(\d+\.\d+\.\d+)/g)].map(match => match[1])
const displayedVersions = [...webHomePage.matchAll(/当前版本 v(\d+\.\d+\.\d+)/g)].map(match => match[1])
if (referencedVersions.length === 0 || displayedVersions.length === 0) {
  throw new Error('Cannot find the plugin version strings in apps/server/web/src/HomePage.tsx.')
}
for (const version of [...referencedVersions, ...displayedVersions]) {
  if (version !== packageVersion) {
    throw new Error(
      `Version mismatch: apps/server/web/src/HomePage.tsx references ${version}, ` +
        `but package.json version is ${packageVersion}. Keep these in sync.`
    )
  }
}

console.log(`Version sync verified: ${packageVersion}`)
