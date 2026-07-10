# GitHub Portfolio Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the React home page as a polished one-page GitHub portfolio for `@haoleng16` with three clickable repositories.

**Architecture:** Keep the existing `Home` route and motion dependency. Replace the current code-rain/tech-wall composition with a data-driven profile hero, GitHub identity card, focus strip, and three external project cards; keep theme behavior in the existing global tokens and keep all other routes untouched.

**Tech Stack:** React 19, React Router, Framer Motion, Vite, plain CSS custom properties.

## Global Constraints

- Modify only `src/pages/Home.jsx`, `src/App.css`, and `src/index.css` for the product change.
- Do not add dependencies, change routes, delete files, or modify unrelated uncommitted work.
- Use only the user-provided GitHub profile and repository URLs; do not invent metrics or technical claims.
- Keep the existing `data-theme` contract for light, dark, and warm themes.
- Preserve accessible focus states, external-link security attributes, and responsive layouts at 320 / 375 / 414 / 768 px.

---

### Task 1: Add a minimal static content contract check

**Files:**
- Create: `scripts/check-home-content.mjs`

**Interfaces:**
- Consumes: `src/pages/Home.jsx` as plain text.
- Produces: process exit `0` when the homepage contains the profile URL and all three repository URLs; exit `1` with the missing URL list otherwise.

- [x] **Step 1: Write the failing check**

Create this script:

```js
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')
const requiredUrls = [
  'https://github.com/haoleng16',
  'https://github.com/haoleng16/label_server',
  'https://github.com/haoleng16/geek',
  'https://github.com/haoleng16/Enterprise_RAG',
]
const missing = requiredUrls.filter((url) => !source.includes(url))

if (missing.length > 0) {
  console.error(`Missing homepage URLs:\n${missing.join('\n')}`)
  process.exit(1)
}

console.log('Homepage GitHub content contract passed.')
```

- [x] **Step 2: Run the check to verify it fails**

Run: `node scripts/check-home-content.mjs`

Expected: FAIL because the current homepage does not include the four required GitHub URLs.

### Task 2: Implement the one-page profile and project composition

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: the existing `Link`, `motion`, and `fadeUp` patterns.
- Produces: visible profile hero, GitHub profile card, focus strip, and three external project cards rendered from a local `projects` array.

- [x] **Step 1: Add the content data and replace the Home markup**

Use a local static data array so the page works without GitHub API access:

```jsx
const githubProfileUrl = 'https://github.com/haoleng16'
const projects = [
  { name: 'label_server', index: '01', note: 'GitHub repository', accent: 'blue', url: 'https://github.com/haoleng16/label_server' },
  { name: 'geek', index: '02', note: 'GitHub repository', accent: 'violet', url: 'https://github.com/haoleng16/geek' },
  { name: 'Enterprise_RAG', index: '03', note: 'GitHub repository', accent: 'amber', url: 'https://github.com/haoleng16/Enterprise_RAG' },
]
```

The returned JSX must include one external anchor for the profile and one for each project, with `target="_blank"` and `rel="noreferrer"` on external links.

- [x] **Step 2: Run the content check**

Run: `node scripts/check-home-content.mjs`

Expected: PASS with `Homepage GitHub content contract passed.`

### Task 3: Style the editorial portfolio across all themes and breakpoints

**Files:**
- Modify: `src/App.css`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: the class names emitted by `Home.jsx` and the existing `data-theme` variables.
- Produces: editorial paper-like surface, responsive profile layout, readable project cards, focus-visible rings, hover/active/disabled states for the project link affordance, and reduced-motion behavior.

- [x] **Step 1: Add named homepage tokens without removing global tokens**

Add semantic page tokens under `:root` and theme overrides under the existing light/dark/warm selectors in `src/index.css`; all Home CSS values must use those variables rather than new inline color literals.

- [x] **Step 2: Replace only the Home-specific CSS rules**

Add styles for `.home-page`, `.home-intro`, `.home-hero-grid`, `.github-profile-card`, `.focus-strip`, `.projects-section`, `.project-card`, and their responsive states. Use `minmax(0, 1fr)`, `overflow-wrap: anywhere`, and `overflow-x: clip` for mobile safety.

- [x] **Step 3: Run the content check and lint**

Run: `node scripts/check-home-content.mjs && npm run lint`

Expected: both commands exit `0`; lint reports no errors.

### Task 4: Verify the production build and inspect the final diff

**Files:**
- Inspect: `src/pages/Home.jsx`
- Inspect: `src/App.css`
- Inspect: `src/index.css`
- Inspect: `scripts/check-home-content.mjs`

**Interfaces:**
- Consumes: completed homepage implementation.
- Produces: verified production bundle and a scoped diff that leaves unrelated user work untouched.

- [x] **Step 1: Run the full verification commands**

Run: `node scripts/check-home-content.mjs && npm run lint && npm run build`

Expected: all commands exit `0`; Vite reports a successful production build.

- [x] **Step 2: Confirm the diff scope**

Run: `git diff -- src/pages/Home.jsx src/App.css src/index.css scripts/check-home-content.mjs`

Expected: the diff contains only the new homepage composition, its styles/tokens, and the static content check.
