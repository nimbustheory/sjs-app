# Slow Jam Sundays — PWA

React + Vite + PWA prototype built by Nimbus Labs.

## Setup

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Deploy

The `dist/` folder after build can be deployed to:
- Netlify (drag and drop)
- Vercel (`vercel --prod`)
- Any static host

## Icons

Before deploying, add your app icons to `/public/icons/`. See `/public/icons/README.txt` for specs.

## Structure

```
src/
  main.jsx      # Entry point
  App.jsx       # Root component
  SJSApp.jsx    # Full app (all screens + styles)
  index.css     # Global reset + base styles
public/
  icons/        # PWA icons (add before deploy)
index.html      # HTML shell
vite.config.js  # Vite + PWA config
```
