# Shoppr Lite

A React capstone project for Tecvinson Frontend Training, Cohort 2025.

Shoppr Lite is a front-end e-commerce app built with React 18, React Router v6, and the native Fetch API. It lets shoppers browse products, filter and search, view full product details, manage a cart, and read blog posts — all powered by a live REST API.

**Deployed URL:** [https://ngshoppr-v2.netlify.app](https://ngshoppr-v2.netlify.app) (Update this after deployment)

---

## Tech Stack

- React 18
- React Router DOM v6 (BrowserRouter + nested routes)
- Vite (build tool)
- CSS Modules (scoped styles per component)
- Lucide React (icons)
- Native `fetch` (no axios)

## Features

- Browse, filter by category, search, and sort products (URL-synced via `useSearchParams`)
- Product detail page: colour → size → qty selection with per-SKU stock validation
- Cart with live item count, qty controls, order summary, free-shipping progress, and clear-cart confirmation
- Blog listing with search and single post view with comments
- Loading skeletons and error states on every data-fetching page
- Fully responsive layout
- 404 catch-all page

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Netlify)

1. Push to GitHub
2. Connect repo on netlify.com
3. Build command: `npm run build`
4. Publish directory: `dist`

The `public/_redirects` file is already included to fix client-side routing on Netlify.

---

Tecvinson Frontend Training · Cohort 2025
