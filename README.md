# My Gorky Site

This site is built with [Gorky](https://github.com/adrenak/gorky), a lightweight, markdown-powered static site generator.

## Getting Started
- Edit `site-config.js` to configure site settings and navigation
- Add your markdown files to `content/`
- Create blog posts in `content/posts/`
- Place images anywhere in `content`, for example `content/images` for using in your markdown files

## Building

```bash
gorky build
```

Or use npm:

```bash
npm run build
```

Your site will be generated as `index.html`. 

If you want to rename or move some things, look at `gorky.config.js`

## Deployment

This site is ready to deploy to GitHub Pages. Simply:

1. Push your code to GitHub
2. Enable GitHub Pages in your repository settings on a branch with index.html
3. Your site will be live!

