---
title: Customization
description: Learn how to customize fonts, colors, and styling to make your website unique
keywords: customization, styling, fonts, colors, CSS, theme
---

# Customization Guide

This guide will help you customize the look and feel of your Gorky website. **Most customization is done through `styles/theme.css`** - this is where you'll find all the important theme-related properties like colors, fonts, and spacing.

## The Most Important File: `theme.css`

**`styles/theme.css` is where most customization happens.** This file contains all theme-related CSS properties organized for easy customization:

- **Fonts** (body, code)
- **Sidebar** background and text colors (idle, hovered, selected states)
- **Content** background color, text color, link colors
- **Content** line spacing
- **Blockquote** colors and borders

Simply edit `styles/theme.css` to change your site's appearance. Most users won't need to touch the other CSS files.

## CSS File Structure

While `theme.css` handles most customization, the styles are organized into several files:

- **`styles/theme.css`** ⭐ - **Most important!** Contains fonts, colors, and theme properties
- **`styles/base.css`** - CSS reset and container layout (rarely needs editing)
- **`styles/layout.css`** - Layout structure, padding, margins (structural properties)
- **`styles/navigation.css`** - Navigation structure and layout (not colors)
- **`styles/content.css`** - Content structure, spacing, typography structure
- **`styles/mobile.css`** - Mobile-specific styles
- **`styles/responsive.css`** - Responsive breakpoints and adjustments

## Customizing Fonts

### Main Body Font

The main font for all content is set in `styles/theme.css`:

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

**To change it**, edit `styles/theme.css` and replace with your preferred font:

```css
body {
    font-family: 'Your Font Name', sans-serif;
}
```

**Using Google Fonts:**

1. Add the font link in `index-template.html` (in the `<head>` section):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
   ```

2. Update `styles/theme.css`:
   ```css
   body {
       font-family: 'Inter', sans-serif;
   }
   ```

**Popular font choices:**
- `'Inter', sans-serif` - Modern, clean sans-serif
- `'Merriweather', serif` - Readable serif font
- `'Playfair Display', serif` - Elegant serif

### Code Font

Code blocks and inline code use a monospace font. Edit `styles/theme.css`:

```css
#markdown-content code,
#markdown-content pre {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
}
```

**Popular monospace fonts:**
- `'JetBrains Mono'` - Modern monospace (already included via Google Fonts)
- `'Fira Code'` - Programming font with ligatures
- `'Source Code Pro'` - Clean code font

## Customizing Colors

All color customization happens in `styles/theme.css`. This is much simpler than before!

### Sidebar Colors

**Sidebar background:**
```css
.sidebar {
    background-color: #f5f5f5;
}
```

**Sidebar text colors (idle state):**
```css
.sidebar-header h1 {
    color: rgb(0, 0, 0);
}

.nav-link {
    color: rgba(0, 0, 0, 0.6);
}

.section-title {
    color: rgba(0, 0, 0, 0.75);
}
```

**Sidebar text colors (hovered state):**
```css
.nav-link:hover {
    background-color: rgb(188, 188, 188);
    color: rgba(0, 0, 0, 0.8);
}
```

**Sidebar text colors (selected/active state):**
```css
.nav-link.active {
    background-color: #000000;
    color: rgb(255, 255, 255);
}
```

### Content Colors

**Content background:**
```css
.main-content {
    background-color: #ffffff;
}
```

**Content text color:**
```css
#markdown-content {
    color: inherit;  /* Uses default browser text color */
}
```

**Content links:**
```css
#markdown-content a,
#tag-posts-list h2 a,
.post-link,
.post-tags .tag-link {
    color: #0066cc;
    font-weight: 600;
}

#markdown-content a:hover,
#tag-posts-list h2 a:hover,
.post-link:hover,
.post-tags .tag-link:hover {
    color: #0052a3;
}
```

All links in your content (blog posts, tag links, post list links) use the same color and weight for consistency.

### Blockquote Colors

Blockquotes are styled in `styles/theme.css`:

```css
#markdown-content blockquote {
    border-left: 4px solid #0066cc;
    color: #666;
}
```

The border color matches your link color by default, but you can customize it.

### Sidebar Footer

Footer colors are also in `styles/theme.css`:

```css
.sidebar-footer {
    background-color: #000000;
}

.footer-text,
.footer-link {
    color: rgba(255, 255, 255, 0.6);
}

.footer-link:hover {
    color: rgba(0, 0, 0, 0.8);
}
```

## Content Spacing

### Line Spacing

Content line spacing is controlled in `styles/theme.css`:

```css
.main-content {
    line-height: 1.7;
}
```

Adjust this value to make text more or less spaced. Common values:
- `1.5` - Tighter spacing
- `1.7` - Default (comfortable reading)
- `1.8` - More breathing room
- `2.0` - Very spacious

## Quick Theme Examples

### Light Theme (Default)

All in `styles/theme.css`:
```css
.sidebar {
    background-color: #f5f5f5;
}

.main-content {
    background-color: #ffffff;
}

#markdown-content a {
    color: #0066cc;
}

.nav-link.active {
    background-color: #000000;
    color: rgb(255, 255, 255);
}
```

### Dark Theme

Edit `styles/theme.css`:

```css
.sidebar {
    background-color: #1a202c;
}

.main-content {
    background-color: #2d3748;
}

#markdown-content {
    color: #e2e8f0;
}

.nav-link {
    color: rgba(255, 255, 255, 0.7);
}

.nav-link:hover {
    background-color: #4a5568;
    color: rgba(255, 255, 255, 0.9);
}

.nav-link.active {
    background-color: #4a5568;
    color: rgb(255, 255, 255);
}

#markdown-content a {
    color: #63b3ed;
}

.sidebar-footer {
    background-color: #1a202c;
}

.footer-text,
.footer-link {
    color: rgba(255, 255, 255, 0.6);
}
```

### Blue Theme

```css
.sidebar {
    background-color: #e3f2fd;
}

.nav-link.active {
    background-color: #1976d2;
    color: rgb(255, 255, 255);
}

.nav-link:hover {
    background-color: #bbdefb;
}

#markdown-content a {
    color: #1565c0;
}

#markdown-content blockquote {
    border-left: 4px solid #1976d2;
}
```

## Tips

1. **Start with `theme.css`**: This file contains 90% of what you'll want to customize. Edit this first!

2. **Test your changes**: After modifying CSS, run `gorky build` and check `index.html` in your browser.

3. **Browser DevTools**: Use your browser's developer tools (F12) to inspect elements and test color changes in real-time before editing files.

4. **Keep it organized**: All theme-related properties are in `theme.css` - use that as your main customization file.

5. **Check file comments**: Each CSS file has comments at the top explaining what it controls.

## Need Help?

- **Check `styles/theme.css` first** - most customization is there
- Read the comments in each CSS file - they describe what each section controls
- Use browser DevTools to inspect elements and see which CSS file controls them
- Test changes incrementally - change one thing at a time to see the effect
