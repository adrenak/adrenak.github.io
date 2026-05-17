Gorky build output — self-contained static site

Upload this entire folder to your web host (as the site root, or match baseUrl in site-config.js if you use a subpath).

Included:
  - HTML pages (index, posts/, post/*/, custom pages)
  - styles/   — copy of your project styles/
  - content/  — copy of non-markdown files from your project content/ (e.g. images)
  - favicon.ico / apple-touch-icon.png — if present at project root when built

Markdown sources stay outside this folder. Run gorky build again after editing content.
