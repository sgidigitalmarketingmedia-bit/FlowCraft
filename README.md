# FlowCraft Studio - Mobile Journey & React Prototype Studio

Interactive Figma-style workboard for product managers and developers to map user journey flows, configure dynamic mobile UI elements, simulate active prototypes, connect live financial data feeds, and export deployable React code.

---

## 🚀 Deploying to Vercel

This application is ready to deploy directly to [Vercel](https://vercel.com) with zero manual configuration.

### Option 1: Deploy via GitHub (Recommended)

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel automatically detects **Vite** and uses the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your app will be live with a production URL and automatic continuous deployment on every push!

### Option 2: Deploy via Vercel CLI

In your terminal:

```bash
# 1. Install or run Vercel CLI directly
npx vercel

# 2. Follow the interactive prompts (Accept defaults detected from vercel.json)

# 3. For production release:
npx vercel --prod
```

---

## 🛠️ Configuration Details

- **`vercel.json`**: Configured with SPA rewrite rules (`/(.*) -> /index.html`) so deep links and browser refreshing work seamlessly without 404 errors. Includes long-term caching headers for production assets.
- **`.vercelignore`**: Excludes temporary files, screenshots source archives, and development scripts from deployment bundles to optimize upload and build speed.
- **Production Build**: Built with Vite 8 + React 19 + Tailwind CSS 4.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Type-check
npm run lint
```
