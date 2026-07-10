# Home CTA Priority Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `ABOUT ME` the primary Hero CTA and move `SEE MY WORK` to the lower secondary link.

**Architecture:** Reuse the two existing anchors in `Home.jsx` and exchange their labels, targets, and appropriate icons. No component, CSS, route, or dependency changes are required.

**Tech Stack:** React JSX, Tailwind utility classes, Vite.

## Global Constraints

- Modify only `src/pages/Home.jsx` for production code.
- Primary CTA must display `ABOUT ME` and link to `#about`.
- Lower secondary CTA must display `SEE MY WORK` and link to `#projects`.
- GitHub link and all layout styling remain unchanged.

---

### Task 1: Swap Hero CTA priority

**Files:**

- Modify: `scripts/check-home-content.mjs`
- Modify: `src/pages/Home.jsx:278-323`

**Interfaces:**

- Consumes: Existing `#about` and `#projects` section anchors.
- Produces: Updated Hero CTA hierarchy without new APIs.

- [ ] **Step 1: Add the failing content assertion**

Update `scripts/check-home-content.mjs` to assert that the primary CTA block contains `href="#about"` followed by `ABOUT ME`, and that the lower secondary block contains `href="#projects"` followed by `SEE MY WORK`.

- [ ] **Step 2: Verify RED**

Run: `node scripts/check-home-content.mjs`

Expected: FAIL because the current primary CTA is still `SEE MY WORK`.

- [ ] **Step 3: Apply the minimal JSX swap**

Change the primary anchor to:

```jsx
<a href="#about" className="group ...">
  ABOUT ME
  <ArrowUpRight ... />
</a>
```

Change the lower anchor to:

```jsx
<a href="#projects" className="animate-fade-up ...">
  <ArrowUpRight ... />
  <span ...>SEE MY WORK</span>
</a>
```

- [ ] **Step 4: Verify GREEN and build**

Run: `node scripts/check-home-content.mjs && npx eslint src/pages/Home.jsx && npm run build`

Expected: content check passes, ESLint exits 0, and Vite build exits 0.

- [ ] **Step 5: Browser-check both anchors**

Confirm the primary anchor is `ABOUT ME → #about` and the lower secondary anchor is `SEE MY WORK → #projects` with no console errors.
