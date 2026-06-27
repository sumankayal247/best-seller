<div align="center">

# 💚 Best Seller

**Discover the highest-selling products across every category on the platforms you love.**

</div>

---

<div align="center">

## 🌐 Live App

# 👉 [**sumankayal247.github.io/best-seller**](https://sumankayal247.github.io/best-seller/) 👈

[![Open Live App](https://img.shields.io/badge/OPEN%20LIVE%20APP-%20-059669?style=for-the-badge&logo=vercel&logoColor=white&labelColor=059669)](https://sumankayal247.github.io/best-seller/)

### 🔗 https://sumankayal247.github.io/best-seller/

</div>

---

> ### ⚠️ Notice
>
> **This app is for my personal use only.**
>
> It was **built with the help of AI**. All product data shown is mock/demo data generated for
> design and prototyping purposes — it is not connected to any real store. This project is not
> affiliated with, endorsed by, or sponsored by any of the e-commerce brands referenced in it.

---

## ✨ What it does

Best Seller is a fast, modern, minimalistic web app for browsing the best-selling products across
popular e-commerce platforms (Amazon, Flipkart, Meesho, Myntra, AJIO, Croma, Reliance Digital,
Tata CLiQ, Snapdeal, Nykaa). Pick a platform → choose from 48+ categories → filter, sort and open
the product on the original store.

### Highlights

- 🏠 **Platform tiles** with real brand logos, hover/elevation and click animations
- 🌍 **Country selector** (India by default) that switches currency and the stores shown
- 🗂️ **24 real categories** in a sticky, searchable, horizontally-scrollable bar
- 🛍️ **Real product data** from the public DummyJSON catalog — images that genuinely match titles,
  with real prices, ratings, brands and reviews
- 📄 **Full product detail page** (image gallery, specs, reviews, related items) — clicking a
  product opens this, not a random search
- 🎛️ **Advanced filters** (price, rating, discount, brand, in-stock) and **sorting** (popular,
  top-rated, biggest discount, price, A–Z)
- 🔎 **Global command-palette search** (`/` or `⌘/Ctrl + K`) across platforms, categories & products
- ❤️ **Favorites**, 🕑 **recently viewed** and **recently visited stores** (saved locally)
- 🌗 **Light / dark mode** with remembered preference and smooth transitions
- ♾️ **Infinite scroll + load more**, skeleton loaders, empty & error states, toasts
- 📱 Fully responsive, accessible (keyboard nav, ARIA, semantic HTML) and code-split for speed

> **On "best sellers over time":** real per-store historical best-seller rankings (this week / this
> year / last 5 years) aren't available from any free public API — they'd require collecting and
> storing ranking snapshots over time behind a backend. Rather than fake them, those filters are
> intentionally omitted; products are ranked transparently by their real rating & popularity.

## 🧱 Tech stack

React · TypeScript · Vite · Tailwind CSS · React Router · Framer Motion · Lucide Icons

## 🏛️ Architecture

The data layer is abstracted behind a repository (`src/services/productRepository.ts`) with a
Promise-based, paginated, filterable interface. Today it serves a seeded in-memory mock catalog;
swapping in a real API or scraping service means reimplementing that one module — **no UI changes
required**.

```
src/
├── components/   # UI primitives + feature components (platform, product, filters, search…)
├── context/      # Theme, Toast and user-data (favorites/recents) providers
├── data/         # Platforms, categories, deterministic mock product catalog
├── hooks/        # useProductFeed, useAsync, useDebounce, useHotkey, useMediaQuery…
├── lib/          # Formatting + className utilities
├── pages/        # Home, Platform, Category, Favorites, NotFound (lazy-loaded)
├── services/     # productRepository (data seam) + localStorage wrapper
└── types/        # Domain types
```

## 🚀 Run locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

> Requires Node 20+.

## 📦 Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the app and publishes it to
GitHub Pages — see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

<div align="center">

Made for personal use, with the help of AI · Demo data only

</div>
