# Portfolio Reference Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task by task, test-driven-development for behavior changes, and verification-before-completion before claiming success.

**Goal:** Redesign the existing React homepage as a polished, single-page GitHub portfolio inspired by the user's reference site while preserving the existing routes, three themes, and all four required GitHub links.

**Architecture:** Keep the page fully static and deterministic. `Home.jsx` owns content and inline decorative SVG components, `App.css` owns page layout and interaction styling, and `index.css` owns theme tokens. Existing `App.jsx`, routing, dependencies, and backend code remain unchanged.

**Tech Stack:** React 19, React Router, Framer Motion, CSS custom properties, inline SVG, Vite.

## Global Constraints

- Modify production code only in `src/pages/Home.jsx`, `src/App.css`, and `src/index.css`.
- Update `scripts/check-home-content.mjs` only to improve homepage acceptance coverage.
- Preserve all unrelated uncommitted work.
- Add no dependencies, network fetches, images, routes, or backend changes.
- Keep all supplied GitHub URLs exact and make external links secure.
- Use only neutral, verifiable portfolio copy.

---

## Task 1: Strengthen the homepage content contract

**Files:**

- Modify: `scripts/check-home-content.mjs`
- Test: `scripts/check-home-content.mjs`

- [ ] Add assertions for the projects anchor, featured project class, all four GitHub URLs, `/blog`, `/bookshelf`, `/agent`, and secure external-link attributes.
- [ ] Run `node scripts/check-home-content.mjs` and confirm it fails because the new page structure is not implemented yet.

## Task 2: Build the reference-inspired homepage structure

**Files:**

- Modify: `src/pages/Home.jsx`
- Test: `scripts/check-home-content.mjs`

- [ ] Define deterministic data for the GitHub profile, featured `Enterprise_RAG` project, secondary `label_server` and `geek` projects, and internal site links.
- [ ] Build a split hero with portfolio label, `HaoLeng`, introductory copy, projects CTA, GitHub CTA, and decorative deterministic particle SVG.
- [ ] Add the alternating focus/about band using only stable statements: `学习`, `开源`, and `持续构建`.
- [ ] Add `id="projects"`, a wide Featured Project panel for `Enterprise_RAG`, an abstract inline SVG diagram, and two secondary repository cards.
- [ ] Add an Explore Site section linking to `/blog`, `/bookshelf`, and `/agent` with React Router links.
- [ ] Ensure every external link uses `target="_blank"` and `rel="noreferrer"`.
- [ ] Run `node scripts/check-home-content.mjs` and confirm it passes.
- [ ] Run `npx eslint src/pages/Home.jsx` and fix any changed-file issues.

## Task 3: Add theme tokens and reference design styling

**Files:**

- Modify: `src/index.css`
- Modify: `src/App.css`

- [ ] Add light, dark, and warm portfolio tokens for paper, alternate paper, surface, ink, muted text, accent, border, and shadow.
- [ ] Implement the 5/7 split hero, generous section rhythm, indigo particle field, featured-project hierarchy, secondary cards, and asymmetric internal-route layout.
- [ ] Scope homepage navigation/footer flattening to the homepage so other routes retain their behavior.
- [ ] Add visible focus states, subtle hover lift, responsive layouts, safe text wrapping, and homepage-scoped overflow protection.
- [ ] Add `prefers-reduced-motion` rules that remove spatial movement.
- [ ] Run `npm run build` and fix any compilation errors.

## Task 4: Browser verification and refinement

**Files:**

- Inspect: rendered homepage
- Modify if needed: `src/pages/Home.jsx`, `src/App.css`, `src/index.css`

- [ ] Start the Vite development server and open the homepage in the in-app browser.
- [ ] Inspect desktop composition, visual hierarchy, all four GitHub links, and internal route links.
- [ ] Verify no horizontal overflow at 320, 375, 414, and 768 pixels.
- [ ] Verify light, dark, and warm themes and confirm the theme control still updates `data-theme`.
- [ ] Check the browser console for errors and visually compare against the approved reference design DNA.
- [ ] Refine only issues found during verification, then repeat the affected checks.

## Task 5: Final verification

**Files:**

- Verify: all changed files

- [ ] Run `node scripts/check-home-content.mjs`.
- [ ] Run `npx eslint src/pages/Home.jsx`.
- [ ] Run `npm run build`.
- [ ] Run a targeted whitespace check for the homepage changes.
- [ ] Report any unrelated pre-existing full-repository lint or whitespace failures separately.

