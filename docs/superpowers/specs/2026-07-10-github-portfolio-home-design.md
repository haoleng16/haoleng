# GitHub Portfolio Home Design

## Goal

把现有首页改造成一个单页完成的个人 GitHub 作品集入口：明确展示 `@haoleng16`，并把三个指定仓库变成可直接跳转的精选项目，同时保留现有导航、主题切换和其他页面入口。

## Design direction

采用 editorial profile 结构：明亮、克制、有纸面感的浅色界面，GitHub 蓝作为主要强调色；现有 light / dark / warm 三主题继续可用，只替换背景、文字、边框与强调色，不改变信息结构。

页面不使用虚构的粉丝数、星标数、项目指标或技术栈描述。项目名称与 GitHub 链接使用用户提供的真实信息，其他文案保持简短、可验证。

## Page structure

1. **Profile hero**
   - 显示 `你好，我是 HaoLeng` 与个人定位文案。
   - 主操作链接到 `https://github.com/haoleng16`。
   - 次操作使用站内路由进入博客。
   - 右侧为 GitHub profile card，展示 `@haoleng16` 和公开主页入口。

2. **Focus strip**
   - 作为 hero 与项目之间的节奏分隔。
   - 只表达“个人学习 / 开源项目 / 持续构建”这类稳定信息，不制造动态数据。

3. **Selected projects**
   - 三张桌面端横向卡片，移动端堆叠。
   - 项目顺序固定为 `label_server`、`geek`、`Enterprise_RAG`。
   - 每张卡完整可点击，使用 `target="_blank"` 和 `rel="noreferrer"` 打开 GitHub 仓库。
   - 卡片使用不同但来自主题 token 的视觉强调色，保持整体统一。

4. **Existing site links**
   - 保留博客、书架、Agent 的站内入口；不新增页面。

## Implementation boundaries

- Modify only `src/pages/Home.jsx`, `src/App.css`, and `src/index.css`.
- Do not delete files, add dependencies, change routes, or modify unrelated uncommitted work.
- Reuse installed `framer-motion`; keep motion limited to opacity and transform.
- Keep the existing theme switcher contract via `data-theme`.
- Keep all interactive elements keyboard accessible with visible `:focus-visible` states.
- Use responsive CSS for 320 / 375 / 414 / 768 px widths without horizontal overflow.

## Data and links

```js
const githubProfileUrl = 'https://github.com/haoleng16'
const projects = [
  { name: 'label_server', url: 'https://github.com/haoleng16/label_server' },
  { name: 'geek', url: 'https://github.com/haoleng16/geek' },
  { name: 'Enterprise_RAG', url: 'https://github.com/haoleng16/Enterprise_RAG' },
]
```

## Acceptance criteria

- 首页首屏可见个人身份与 GitHub 主入口。
- 三个项目均在首页展示，且点击卡片会打开对应 GitHub 仓库。
- 首页不依赖 GitHub API 运行，公开链接在离线或 API 限流时仍可显示。
- 三主题切换仍可用，项目卡片在三主题下保持可读。
- 既有导航、动画与站内路由不回归。
- `npm run lint` 与 `npm run build` 均通过。
