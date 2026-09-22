# CoursNest

CoursNest is a free bilingual learning platform with 30 practical courses, browser-only progress tracking, optional quizzes and GitHub Pages-ready static files.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm --filter @workspace/coursnest run dev` — run the live CoursNest preview

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `index.html`, `courses.html`, `categories.html`, `about.html`, contact/legal pages, `404.html`, `robots.txt` and `sitemap.xml` are the GitHub Pages-ready root site.
- `courses/` contains exactly 30 course pages and the shared static page shell.
- `blog/` contains the Learning Center and original articles.
- `css/style.css`, `js/courses.js` and `js/main.js` are the source of truth for the static site.
- `artifacts/coursnest/` is the rich live project preview.

## Architecture decisions

- The production export is intentionally static HTML/CSS/vanilla JavaScript so it can deploy to GitHub Pages with no build step, backend or paid service.
- Course content lives locally in `js/courses.js`; lesson completion, quiz scores and language preference use browser local storage.
- The live artifact preview uses the same product direction but is kept separate from the GitHub Pages export to preserve the zero-dependency deployment requirement.
- `USERNAME` is a deliberate deployment placeholder in canonical URLs, `robots.txt` and `sitemap.xml`; it must be replaced by the real GitHub username before publishing.

## Product

Users can browse exactly 30 practical courses, search and filter the library, switch between English and Arabic, read multi-module lessons, track local progress, take optional quizzes and print a browser-generated completion certificate. The site also includes a Learning Center, about/contact/legal pages and a real root `404.html`.

## User preferences

- Keep the core product free to run and independent of paid APIs, databases, authentication, hosting or build services.

## Gotchas

- Replace `USERNAME` placeholders before submitting the sitemap or publishing.
- GitHub Pages needs `index.html` at the repository root and case-sensitive relative paths.
- The course pages are static shells that render their local course data in the browser; keep `js/courses.js` and `js/main.js` beside the root site when exporting.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
