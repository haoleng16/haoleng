# Portfolio Reference Redesign Design

## Goal

以用户自有站点 `https://porfolio-ten-opal.vercel.app/` 的设计 DNA 为参考，重新设计当前 React 网站首页。新版首页必须保留 `@haoleng16` 的个人身份、三个指定 GitHub 仓库、现有博客 / 书架 / Agent 入口和三主题能力，同时形成接近参考站点的长页作品集叙事。

## Provenance

- Source mode: public HTTPS URL plus rendered screenshot inspection.
- Source ownership: user confirmed the reference site is their own.
- Extraction date: 2026-07-10.
- The redesign carries structural DNA, typography roles, colour bands and motion language. It does not copy the source site's name, biography, images or project copy.

## Studied design DNA

- Macrostructure: Long Document / Portfolio Index.
- Hero: H2 Split, approximately 5/7, copy on the left and a generative particle field on the right.
- Navigation: restrained sticky horizontal navigation with a theme control.
- Footer: minimal copyright and route links.
- Display and body: Inter-style neutral grotesque; mono labels use the existing monospace stack.
- Light paper: `#FAFAF8`; alternate paper: `#F5F3EE`; light accent: `#6366F1`.
- Dark paper: `#0F0F1A`; dark accent: `#818CF8`.
- Rhythm: generous 88–96px section spacing, left-biased headings, alternating paper bands.
- Motion: restrained fade-up reveals, SVG particle drift, transform/opacity only.

## Page structure

### 1. Split hero

- Left column displays `PERSONAL PORTFOLIO`, `HaoLeng`, the existing personal-study positioning and two actions.
- Primary action links to `#projects`; secondary action opens `https://github.com/haoleng16` in a new tab.
- Social row contains the GitHub profile only; no unsupported social accounts are invented.
- Right column contains a deterministic SVG particle constellation with indigo nodes and a few connecting paths.
- The constellation is decorative, uses `aria-hidden="true"`, and collapses below the copy on mobile.

### 2. Focus / about section

- Alternating warm-paper background.
- Reuses the stable statements `学习`, `开源`, and `持续构建`.
- Contains a short paragraph explaining that the site collects projects, notes and experiments.
- Does not add years of experience, locations, job titles, follower counts or other unverified claims.

### 3. Selected projects

- Section id is `projects` so the hero action can scroll to it.
- `Enterprise_RAG` is the Featured Project and receives a wide two-column panel.
- The featured panel uses an abstract RAG/network diagram built with SVG; no screenshot or fake product UI is used.
- `label_server` and `geek` appear as two secondary project cards below the feature.
- All three cards open their supplied GitHub URLs using `target="_blank"` and `rel="noreferrer"`.
- Project descriptions remain neutral unless verified repository descriptions are supplied. The initial implementation uses only repository names, `GitHub repository`, and stable portfolio language.

### 4. Explore the site

- Three restrained route cards link to `/blog`, `/bookshelf`, and `/agent`.
- Cards use the reference site's simple bordered-card language instead of a generic feature grid treatment: one larger lead card and two compact rows on desktop, a single column on mobile.

### 5. Footer

- Existing footer remains responsible for copyright and site routes.
- Visual styling is flattened to match the reference: hairline divider, no heavy glass panel.

## Theme mapping

- `light`: warm-neutral paper, dark navy ink, indigo accent.
- `dark`: deep navy paper, soft grey text, periwinkle accent.
- `warm`: cream paper, brown-black ink, muted violet accent.
- Theme switching continues to use the existing `data-theme` attribute and localStorage behavior.
- Theme changes may animate colour and background over 240–400ms; focus rings appear instantly.

## Motion and interaction

- Reuse installed Framer Motion; add no animation dependency.
- Hero copy reveals once with a short stagger.
- Particle nodes drift subtly through `transform` and `opacity`; no continuous canvas rendering loop is needed.
- Project sections fade upward once when entering the viewport.
- Cards lift no more than 4px and do not scale.
- `prefers-reduced-motion` removes spatial movement and keeps a short opacity transition.
- All links receive a visible `:focus-visible` outline with at least 3:1 contrast.

## Architecture and data flow

- `src/pages/Home.jsx` owns static profile, project and site-link data plus page markup.
- `src/App.css` owns the reference-DNA page layout, responsive rules and component states.
- `src/index.css` owns light / dark / warm colour tokens and global typography tokens.
- No network request is required to render the page. GitHub API failure or rate limiting cannot hide the projects.
- Existing routes and `App.jsx` behavior remain unchanged.

## Implementation boundaries

- Modify only `src/pages/Home.jsx`, `src/App.css`, and `src/index.css` for production code.
- Update the existing homepage content check only if needed to verify structure and link attributes.
- Do not add dependencies, images, routes or backend changes.
- Do not modify or discard unrelated uncommitted work.
- Remove superseded Home-only CSS selectors when safe, while preserving shared styles used by Bookshelf and other pages.

## Responsive behavior

- Desktop: split hero, wide Featured Project, two secondary project cards.
- 768px: hero may remain split only if both columns preserve readable widths; project cards become one or two columns based on available width.
- 414 / 375 / 320px: single-column hero, constellation reduced in height, all project cards stacked, section headings left-aligned.
- No horizontal overflow at 320 / 375 / 414 / 768px.
- Display headings use `overflow-wrap: anywhere` and grid tracks use `minmax(0, 1fr)`.

## Verification

- Run `node scripts/check-home-content.mjs` and confirm all four GitHub URLs remain present.
- Run ESLint on `src/pages/Home.jsx`.
- Run `npm run build`.
- Verify the rendered page at 320 / 375 / 414 / 768px.
- Verify light, dark and warm theme transitions.
- Verify the Featured Project and both secondary project links.
- Check browser console errors and reduced-motion CSS.

## Acceptance criteria

- The homepage is recognizably derived from the reference site's split hero, indigo palette, generous long-page rhythm and featured-project hierarchy.
- `Enterprise_RAG` is visibly the flagship project.
- `label_server` and `geek` remain visible and directly clickable.
- The GitHub profile remains accessible from the hero.
- Blog, Bookshelf and Agent remain accessible from the homepage.
- Three themes and all existing routes continue to work.
- No unsupported personal claims, metrics or external profiles are introduced.

