## 中文

**v0.5.20 · Android build 65**

- 修复 Desktop 退出账号后 Remote 登录入口无法恢复的问题，并支持临时断线后自动重连 Harness 会话（#173），不重放操作；CodeX/ACP 虚拟工作区仍需手动重新打开。
- 修复 Desktop 插件安装时 WebRTC 回退依赖加载失败的问题（#149）。
- Android 新增自动化任务列表、筛选、详情与删除入口，并补齐主机侧栏多语言文案（#176）。
- Android 支持从系统文件选择器添加附件（#174）。
- 修复连续点击新会话按钮创建多余空会话的问题（#175）。
- 改进 Android 息屏连接与唤醒恢复（#172）。

## English

**v0.5.20 · Android build 65**

- Restore Remote sign-in after Desktop sign-out and automatically reconnect Harness sessions after transient connection loss (#173), without replaying operations. CodeX/ACP virtual workspaces still require manual reopening.
- Fix WebRTC fallback dependency loading in Desktop plugin installations (#149).
- Add Android automation task lists, filters, details and deletion, with localized Host sidebar labels (#176).
- Add attachments from Android's system file picker (#174).
- Prevent repeated new-session taps from creating redundant empty conversations (#175).
- Improve Android screen-off connections and recovery on resume (#172).
