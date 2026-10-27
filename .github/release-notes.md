## 中文

**v0.5.20 · Android build 65**

- 新增原生 Remote Agent 工具，可发现在线 Host 与工作区、创建和发送 Harness 会话任务、读取历史、等待执行及请求中断。
- 支持将 Harness 工作区文件下载到插件运行的本机，并将获准发送的本地文件上传到 Harness 工作区；上传在 LAN/直连 P2P 下支持 1 GiB，中继连接保持 20 MiB，已有文件不会被覆盖。
- Android Host 会话抽屉恢复按 Agent 后端浏览、按 Host 保存分组展开状态、最近会话和工作区切换入口。
- 修复 Remote 工作区浏览器底部选择栏被遮挡的问题，并在 Remote 模式隐藏仍会打开本机浏览器的侧栏入口。
- 修复 Remote 上传在本地文件或目标预检失败时错误返回 unknown 回执的问题。
- 修复 Desktop 退出账号后 Remote 登录入口无法恢复的问题，并支持临时断线后自动重连 Harness 会话（#173），不重放操作；CodeX/ACP 虚拟工作区仍需手动重新打开。
- 修复 Desktop 插件安装时 WebRTC 回退依赖加载失败的问题（#149）。
- Android 新增自动化任务列表、筛选、详情与删除入口，并补齐主机侧栏多语言文案（#176）。
- Android 支持从系统文件选择器添加附件（#174）。
- 修复连续点击新会话按钮创建多余空会话的问题（#175）。
- 改进 Android 息屏连接与唤醒恢复（#172）。

## English

**v0.5.20 · Android build 65**

- Add native Remote Agent tools to discover online Hosts and workspaces, create and message Harness sessions, read history, wait for execution, and request interruption.
- Download Harness workspace files to the plugin machine and upload authorized local files into a Harness workspace; uploads support 1 GiB over LAN/direct P2P and retain the 20 MiB limit over relays, without overwriting existing files.
- Restore backend-aware Android Host session browsing, per-Host group expansion state, recent sessions, and the workspace switch entry.
- Fix the Remote workspace selection footer being obscured, and hide the sidebar browser entry that would still open a local browser while Remote mode is active.
- Fix Remote upload receipts incorrectly reporting local-file and target preflight failures as unknown.
- Restore Remote sign-in after Desktop sign-out and automatically reconnect Harness sessions after transient connection loss (#173), without replaying operations. CodeX/ACP virtual workspaces still require manual reopening.
- Fix WebRTC fallback dependency loading in Desktop plugin installations (#149).
- Add Android automation task lists, filters, details and deletion, with localized Host sidebar labels (#176).
- Add attachments from Android's system file picker (#174).
- Prevent repeated new-session taps from creating redundant empty conversations (#175).
- Improve Android screen-off connections and recovery on resume (#172).
