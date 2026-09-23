---
name: Google Pages site name
description: How CoursNest signals its brand to Google while hosted on GitHub Pages.
---

Google may display “GitHub” for a `*.github.io` result because the hosting domain is part of the visible site identity. Keep the real production hostname consistent in canonical URLs, robots.txt, sitemap.xml, Open Graph metadata and WebSite/Organization JSON-LD, and use a custom domain when the hosting label must disappear.

**Why:** Google controls the final site-name label and a GitHub Pages hostname can override the brand even when the page title is correct.

**How to apply:** Treat structured data and a real sitemap as discoverability signals, not a guarantee that Google will replace the hosting name.