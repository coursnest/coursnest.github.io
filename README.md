# CoursNest

CoursNest is a free, bilingual learning platform with exactly 30 practical courses, local progress tracking, optional quizzes, a printable browser certificate, a learning center and GitHub Pages-safe static files.

## Zero-dollar GitHub Pages deployment

1. Create a GitHub repository named `USERNAME.github.io`, replacing `USERNAME` with the actual GitHub username. For example, the username `CoursNest` uses `CoursNest.github.io`.
2. Upload the contents of this repository with `index.html` at the repository root.
3. In GitHub, open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main`, choose `/ (root)`, and save.
5. The root site will be available at `https://USERNAME.github.io/`.

Before publishing, replace the `USERNAME` placeholder in `sitemap.xml`, `robots.txt`, canonical tags and Open Graph URLs with the actual GitHub username. Replace `hello@example.com` on `contact.html` with the real contact address. No backend, database, build step, paid service or API is required for the static site.

## Static structure

- `index.html`, `courses.html`, `categories.html`, legal pages and `404.html` are real root HTML pages.
- `courses/` contains exactly 30 course HTML files plus a shared browser-rendering shell.
- `blog/` contains the Learning Center index and 9 original articles.
- `css/style.css` contains the responsive visual system.
- `js/courses.js` contains the bilingual course data, lesson modules and 5-question quiz for each course.
- `js/main.js` provides search, filtering, Arabic/English switching, local progress, quiz feedback and printable certificates.

## Local preview

The live project preview is available from the project workspace. The exported website itself is plain HTML, CSS and JavaScript and can be opened directly or served by GitHub Pages.