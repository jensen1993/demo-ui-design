# 可选的每日自动更新

此功能在同事的电脑上建立**当前用户**的定时任务，每天本地时间 10:00 尝试从本仓库获取新版。电脑关机、离线、用户未登录或系统休眠时，不保证在 10:00 执行；网络恢复后会在后续计划运行时重试。下载后 AI 工具可能需要开启新对话、重新加载或重启，不能保证已经开始的会话立即切换版本。GitHub 更新并不会直接触发所有电脑立即更新。

## 重要前提

- 仅适用于 macOS 和 Windows；需安装 Git 与 Node.js 18 或更新版本，且初次安装时可在终端运行 `git` 和 `node`。
- 定时任务必须由**每位同事本人在自己的电脑上**运行一次安装命令；安装会创建 macOS LaunchAgent 或 Windows 当前用户的计划任务。不会收集或上传文件、密码或使用数据；连接的远程地址限于 `https://github.com/jensen1993/demo-ui-design`。该公开仓库后续内容将被自动下载并由 AI 工具使用，请确认信任仓库维护者。
- Skill 必须是独立 Git 克隆、位于 `main` 分支、`origin` 为本仓库。更新前会检查所有已跟踪、未跟踪及被忽略的本地文件变化；有变动、分支不对、来源不同、历史不能快进或联网失败时不覆盖文件。日志位于用户目录 `.demo-ui-design-updater/` 中，可能包含本机文件路径，请勿公开分享。
- 原来通过复制文件安装的版本不能直接自动更新。请先备份原目录；由本人或 AI 助手确认安装位置，再克隆为独立 Git 仓库。不要删除或覆盖现有的个人修改。
- 每个 Skill 安装目录需要单独设置一次。Codex 的个人目录通常为 `~/.codex/skills/demo-ui-design`；其他工具请确认实际安装目录和该工具是否会读取该目录。WorkBuddy 或其他工具如果把导入的 Skill 复制到自己的内部目录，外部 Git 更新不代表其内部副本也自动变化，必须针对实际工具验证。

## 一次性配置

推荐把下面的话发给同事使用的 AI 助手，让它根据电脑系统和实际工具执行，且遇到已有目录时先保留并说明：

> 请从 https://github.com/jensen1993/demo-ui-design 安装 demo-ui-design Skill 到当前工具实际读取的个人 Skill 目录；如果已有同名目录，请先检查并备份，不要覆盖我的修改。然后查看仓库的 AUTO-UPDATE.md，帮我配置每天自动更新。完成后检查计划任务、运行一次更新并告诉我日志位置和是否需要重启工具。

对于已经以 Git 克隆安装的 Skill，在**该 Skill 目录**中执行：

```text
node scripts/auto-update.mjs install
node scripts/auto-update.mjs update
```

`install` 创建系统定时任务；`update` 立即检查一次。安装结果及出错信息会写入用户目录 `.demo-ui-design-updater` 的日志。安装前请检查脚本源码。若有多个 AI 工具各自使用独立目录，需要对每个目录分别操作。

### 停止自动更新

在该 Skill 目录中执行：

```text
node scripts/auto-update.mjs uninstall
```

这会移除该目录对应的定时任务和配置，保留 Skill 文件和日志。更换安装目录前应先卸载旧目录的任务。若旧目录被删除或计划任务被手动更改，需要在系统的启动代理/任务计划程序中手动清理。

## 维护者测试

```text
node --test scripts/test-auto-update.mjs scripts/test-audit-layout.mjs
```

自动更新测试使用临时 Git 仓库，检查快进更新、本地修改保护、来源和分支验证、离线失败及分叉历史。开发环境曾在临时 macOS 用户目录实测 LaunchAgent 的安装、手动更新和卸载；定时触发、Windows 计划任务及其他产品的 Skill 重新加载仍需在对应电脑上验证。
