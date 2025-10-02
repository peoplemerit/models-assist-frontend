# PMERIT Frontend

Mobile-first → desktop responsive frontend for the PMERIT platform, extracted from `blueprint-index.html` and branded with the palette/typography defined in `Pmerit-theme_typography.html`.

## Live site

After the first push to `main`, GitHub Actions will deploy automatically via **GitHub Pages**.  
(Repository → Settings → Pages → Source: **GitHub Actions**.)

## Repository layout

├─ index.html
├─ templates/
│ └─ base.html # Shell (head imports, slots for header/grid/footer)
├─ partials/
│ ├─ header.html
│ ├─ footer.html
│ ├─ aside-left.html
│ ├─ aside-right.html
│ ├─ mobile-accordions.html
│ └─ modals/
│ ├─ sign-in.html
│ ├─ sign-up.html
│ ├─ voices.html
│ ├─ tracks.html
│ └─ assessment.html
├─ sections/
│ └─ main-chat.html
├─ assets/
│ ├─ css/
│ │ ├─ 00-reset.css
│ │ ├─ 01-tokens.css # neutral tokens mapped to brand vars
│ │ ├─ 02-theme-pmerit.css # palette & type from Pmerit-theme_typography.html
│ │ ├─ 10-base.css
│ │ ├─ 20-layout.css
│ │ ├─ 30-components.css
│ │ ├─ 40-modules.css
│ │ └─ 90-responsive.css
│ └─ js/
│ ├─ core/
│ │ ├─ state.js
│ │ ├─ dom.js
│ │ └─ i18n.js
│ └─ ui/
│ ├─ modes.js
│ ├─ chat.js
│ ├─ modals.js
│ ├─ tracks.js
│ └─ responsive.js
│ └─ app.js
└─ .github/workflows/pages.yml


## Branding: how it’s wired

- `02-theme-pmerit.css` defines brand variables (e.g., `--pmr-primary`, typography scale).
- `01-tokens.css` maps generic tokens to brand vars (e.g., `--primary: var(--pmr-primary)`).
- All components use tokens only, so changing the theme file updates the entire UI.

## Develop locally

- Open the folder with VS Code and use “Live Server” (or any static server).
- No build step is required for plain HTML/CSS/JS. If we add a bundler later, the Pages workflow already supports an optional `npm run build`.

## Deployment (GitHub Pages)

- The workflow in `.github/workflows/pages.yml` auto-deploys on push to `main`.
- It uploads `dist/` if present, else `public/`, else the repository root.

## Roadmap (phases)

1. **Design tokens & brand**: create `01-tokens.css` and `02-theme-pmerit.css`.
2. **Extract HTML** into partials/sections; assemble with `templates/base.html`.
3. **Extract CSS** into layered files; replace hard-coded colors with brand tokens.
4. **Extract JS** into modules; initialize via `assets/js/app.js`.
5. **Mobile & orientation**: polish 100dvh, safe areas, landscape tweaks.
6. **Desktop grid**: 3-column estate with asides.
7. **Assistant unification**: single PMERIT Assistant with mode badges.
8. **Propagate to all pages**: reuse base template & partials.
9. **Perf & a11y**: minify, Lighthouse ≥90, WCAG AA contrast.

## Contributing

- Branch: `feature/*` → PR → merge to `main`.
- Use semantic commits: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`.

## Copilot prompts (quick)

- _“Create `assets/css/02-theme-pmerit.css` with CSS variables for the PMERIT brand. Map `--primary`, `--accent`, etc. in `01-tokens.css` to `--pmr-*`.”_
- _“Extract header/footer/aside/modals from `blueprint-index.html` into `partials/`, and wire `templates/base.html` + `index.html`.”_
- _“Split inline style into layered CSS files and replace hex colors with token variables.”_
