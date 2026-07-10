# Home CTA Priority Swap Design

## Goal

调整首页 Hero 的行动入口层级，让 `ABOUT ME` 成为主要按钮，让 `SEE MY WORK` 成为下方次要入口。

## Approved interaction

- 主按钮文本改为 `ABOUT ME`，链接至 `#about`。
- 下方次要入口文本改为 `SEE MY WORK`，链接至 `#projects`。
- 主按钮继续使用现有箭头图标；次要作品入口也使用箭头图标，不再使用人物图标。
- GitHub 次要链接保持不变。

## Scope

- 仅修改 `src/pages/Home.jsx`。
- 不修改布局、颜色、动画、响应式规则、项目内容或其他页面。
- 不增加依赖。

## Verification

- 内容检查确认 `ABOUT ME` 与 `#about` 位于主 CTA。
- 内容检查确认 `SEE MY WORK` 与 `#projects` 位于下方次要入口。
- 运行首页 ESLint 与生产构建。
- 在浏览器中确认两个入口可见且锚点正确。
