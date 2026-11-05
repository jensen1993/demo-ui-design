# Demo UI Design Skill

面向 AI 编程助手的 Demo 界面设计 Skill，帮助团队根据业务需求制作更美观、可交互、可检查的浏览器演示界面。支持 PC 网页和面向手机浏览器的 App、H5、小程序风格演示。

## 能做什么

- 根据业务、目标设备和现有技术栈选择视觉风格、配色与合适的 UI 组件库。
- 新建可运行 Demo 时，默认实际使用合适的 UI 组件库和 Font Awesome Free 图标。
- 参考 Apple 的排版、布局与交互原则，结合具体平台和品牌设计；不是苹果官方组件或认证。
- 根据需求文档构造匹配业务的示例数据和图片，标明演示或模拟内容。
- 检查页面布局、文字、交互、数据及交付状态；用户要求发布时，环境支持可使用 SiteDock。

App、小程序等名称默认描述的是演示体验；交付物通常是手机浏览器可打开的 Demo，不会默认打原生 App 或小程序包。真实后端、支付等集成需另行明确。

## 安装

需要支持读取 `SKILL.md` 的 AI 工具。**整个仓库就是一个 Skill 目录**，请保留 `SKILL.md`、`references/`、`scripts/` 和 `agents/` 的相对结构，不要只复制入口文件。

可以把仓库地址交给 AI 助手，请它安装到该工具的 Skill 目录：

```text
请从 https://github.com/jensen1993/demo-ui-design 安装 demo-ui-design Skill，保留完整目录结构。
```

对于 Codex，也可以用 Git 安装到个人 Skill 目录。以下命令适用于 macOS / Linux，并要求已安装 Git；若目录已经存在，先备份或使用下面的更新方法，不要覆盖自己的修改：

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/jensen1993/demo-ui-design.git ~/.codex/skills/demo-ui-design
```

安装后开启新会话或让工具重新加载 Skill。WorkBuddy、OpenCode 等工具的 Skill 安装路径、发现方式和调用能力以各自实际版本为准；仅复制文件不保证所有产品都能识别。请让对应工具检查它的 Skill 配置。

## 更新

仓库更新不会自动更新同事电脑上的副本。若是按上面的 Git 方式安装，且没有本地修改，可以执行：

```bash
git -C ~/.codex/skills/demo-ui-design pull --ff-only
```

如果本地有修改或安装方式不是 Git，请先备份，再根据所在工具的方式更新完整目录。更新后重启会话或重新加载 Skill。请只从可信来源更新；检查更新内容后再用于工作。

## 使用示例

```text
使用 demo-ui-design，根据这份需求文档的功能清单，制作一个手机端演示 UI。
```

```text
使用 demo-ui-design，做一个 PC 设备维修后台 Demo，完成后发布并给我访问链接。
```

Skill 会根据目标和技术栈选择合适的 UI 库，以实际项目约束为准。发布需要用户明确要求；SiteDock 也需要当前环境已连接且具备发布权限。没有相应能力时，应如实说明并提供可用的本地预览或其他可行结果。

## 验收与验证

交付检查覆盖需求范围、组件和图标、主要交互、响应式布局、字体与对比度、图片与数据，以及发布结果。每项应记录通过、未通过、不适用或未检查，发现阻塞问题时修复并复查。检查清单见 [acceptance-checklist.md](references/acceptance-checklist.md)。

布局检查脚本评估提供的浏览器测量值，并不自动证明视觉效果或无障碍合规。维护者可在安装了 Node.js 的环境下运行脚本回归测试：

```bash
node --test scripts/test-audit-layout.mjs
```

Skill 是指导 AI 的文件，执行效果取决于模型、工具权限、网络、浏览器与实际项目；不能保证所有模型都会严格遵循，也不能把网页预览当作真机验收。

## 第三方组件与许可

UI 组件库、Font Awesome Free、图片和其他资源各有自己的许可证及使用条件，使用时请检查实际版本、素材来源及分发要求。此仓库目前没有单独声明代码许可证；公开可访问本身不等于授予所有再分发或商用权限。
