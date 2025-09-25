# Avangard Bank Frontend – Portfolio Summary

This README summarizes the core contributions and pinpoints exactly what to screenshot or highlight for your internship portfolio. It also includes short embedded snippets and direct links to the key files in the repo.

## Quick Links
- LaTeX PDF portfolio source: `docs/portfolio/main.tex`
- App root layout: `src/app/layout.tsx`
- Stabilized header: `src/components/SiteHeader.tsx`
- Lazy/dynamic components: `src/components/LazyComponents.tsx`
- Home client page: `src/app/[locale]/HomeClient.tsx`
- Language/i18n context: `src/contexts/LanguageContext.tsx`
- Dynamic metadata: `src/components/DynamicMetadata.tsx`
- Client root (landmarks, helpers): `src/components/ClientRoot.tsx`
- Cache utilities & SW policy: `src/lib/cache.ts`
- Next config (security): `next.config.ts`
- Tailwind/PostCSS: `postcss.config.mjs`, `src/app/globals.css`
- Budgets/scripts: `.size-limit.json`, `package.json`
- Example pages: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/products/page.tsx`

---

## What to Screenshot (with Captions)

- **Stabilized SSR/CSR Header** — `src/components/SiteHeader.tsx`
  - Caption: “Pinned initial classes for hydration stability; removed transparent/scroll branches. Sticky white header, dark text.”

- **Home Client Orchestration** — `src/app/[locale]/HomeClient.tsx`
  - Caption: “Client composition with `SiteHeader`, `DynamicMetadata`, smart prefetch, and safe translation fallback `tr()`.”

- **Lazy Loading & Preloading** — `src/components/LazyComponents.tsx`
  - Caption: “Dynamic imports with SSR flags and loading fallbacks; `LazySiteHeader` and a generic lazy wrapper.”

- **Language Context (i18n routing + lang)** — `src/contexts/LanguageContext.tsx`
  - Caption: “URL-based locale, `ua` → `uk` mapping for valid BCP‑47 HTML `lang`, and router updates on language change.”

- **Dynamic Metadata** — `src/components/DynamicMetadata.tsx`
  - Caption: “Title/OpenGraph/Twitter meta updates with safe fallbacks; document `lang` normalization.”

- **Accessibility Landmarks** — `src/app/layout.tsx` and `src/components/ClientRoot.tsx`
  - Caption: “`<main role="main">` and skip link; complementary landmark for auxiliary UI.”

- **Cache & Service Worker Policy** — `src/lib/cache.ts`
  - Caption: “Memory/persistent caches and dev-only SW unregistration to avoid stale bundles/hydration issues.”

- **Security Headers** — `next.config.ts`
  - Caption: “CSP and security headers through Next.js config.”

- **Tailwind v4 + PostCSS** — `postcss.config.mjs`, `src/app/globals.css`
  - Caption: “Modern Tailwind setup with `@tailwindcss/postcss` and `@import "tailwindcss";`.”

- **Budgets & Scripts** — `.size-limit.json`, `package.json`
  - Caption: “Bundle budgets and scripts incl. analyze/build/dev; performance governance in CI.”

- **Feature Pages** — `about/page.tsx`, `products/page.tsx`
  - Caption: “Domain content with consistent header, sections, and icons.”

---

## Embedded Snippets (Short Excerpts)

### 1) Stabilized Header – `src/components/SiteHeader.tsx`
```tsx
// Fixed classes to ensure SSR/CSR match
const headerClasses = 'z-40 transition-all duration-300 ease-in-out sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200'
const textClasses = 'text-gray-900'
const navLinkClasses = 'text-gray-700 hover:text-yellow-400'
```

### 2) Safe Translation Fallback – `src/app/[locale]/HomeClient.tsx`
```tsx
const tr = (key: string, fallback: string) => {
  const v = t(key)
  const looksLikeKey = typeof v === 'string' && /[._]/.test(v) && !/\s/.test(v)
  if (!v || v === key || looksLikeKey) return fallback
  return v
}
```

### 3) Dynamic Imports – `src/components/LazyComponents.tsx`
```tsx
export const LazySiteHeader = dynamic(
  () => import('./SiteHeader').then(mod => ({ default: mod.SiteHeader })),
  { loading: () => <LoadingStates.Header />, ssr: true }
)
```

### 4) HTML lang normalization – `src/contexts/LanguageContext.tsx`
```tsx
document.documentElement.lang = urlLang === 'ua' ? 'uk' : urlLang
```

### 5) Metadata with fallbacks – `src/components/DynamicMetadata.tsx`
```tsx
const title = t('site.title') && t('site.title') !== 'site.title' ? t('site.title') : 'Авангард Банк'
const description = t('site.description') && t('site.description') !== 'site.description' ? t('site.description') : 'Офіційний сайт Авангард Банк.'
document.title = title
document.documentElement.lang = language === 'ua' ? 'uk' : language
```

### 6) Landmarks – `src/app/layout.tsx`
```tsx
<main id="main-content" role="main">
  {children}
</main>
```

### 7) Dev SW policy – `src/lib/cache.ts`
```ts
if (process.env.NODE_ENV !== 'production') {
  navigator.serviceWorker.getRegistrations?.().then((regs) => {
    for (const reg of regs) reg.unregister().catch(() => {})
  }).catch(() => {})
  return
}
```

---

## What You Can Claim

- **Hydration fix and header stabilization**: Eliminated SSR/CSR mismatch by removing dynamic first-paint branches and invalidating stale client chunks.
- **i18n + a11y compliance**: Correct BCP‑47 `lang` values (`ua` → `uk`), skip links, and landmark roles.
- **Performance engineering**: Dynamic imports with thoughtful SSR settings, budgets, and analysis hooks; optional performance dashboard.
- **Caching and PWA discipline**: Memory and persistent caches, plus a pragmatic dev vs prod SW policy to avoid development-time cache pitfalls.
- **Security hardening**: Central security headers and CSP via `next.config.ts`.

---

## How to Export as PDF (Optional)

Use the LaTeX source at `docs/portfolio/main.tex`:

```bash
# From docs/portfolio/
pdflatex -interaction=nonstopmode -halt-on-error main.tex
# or
xelatex -interaction=nonstopmode -halt-on-error main.tex
```

For minted (syntax highlighting), ask to convert the template and compile with `-shell-escape`.

---

## Suggested One‑Page “Contributions” Section (copy/paste)

- Stabilized header component to resolve React hydration mismatches (SSR/CSR parity).
- Implemented i18n language normalization (`ua` → `uk`) for HTML `lang` and accessibility.
- Added performance-oriented lazy imports and preloading with SSR-aware flags.
- Implemented dev SW unregistration to prevent stale caches; kept SW for production only.
- Ensured accessibility landmarks and navigation aids (skip link, main/complementary roles).
- Added/maintained security headers and CSP via Next.js config.
- Prepared a LaTeX portfolio with code listings and a Markdown summary for submission.
