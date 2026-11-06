# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Praktijk Noortje — a Next.js 14 website for a hypnotherapy/EMDR practice, using TinaCMS as a headless CMS for content management. Built with React 18, TypeScript, and Tailwind CSS.

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Dev server with TinaCMS (runs tinacms dev -c "next dev")
pnpm build                # Production build (tinacms build && next build)
pnpm build-local          # Build without cloud checks (local content only)
pnpm start                # Production server (tinacms build && next start)
pnpm lint                 # ESLint (next lint)
```

- Dev site: http://localhost:3000
- TinaCMS admin: http://localhost:3000/admin
- TinaCMS GraphQL playground: http://localhost:4001/altair/

## Architecture

### Routing & Page Rendering

Next.js App Router with a server/client component split for TinaCMS live editing:
- `app/[...filename]/page.tsx` — Server component that fetches Tina data at build time via `generateStaticParams()`
- `app/[...filename]/client-page.tsx` — Client component wrapping data with `useTina()` hook for live preview
- `app/posts/` — Blog section with same server/client pattern

### TinaCMS Content System

- **Config:** `tina/config.tsx` — collections, media, auth
- **Collections:** `tina/collection/` — schemas for `page`, `post`, `author`, `global`
- **Generated types:** `tina/__generated__/` — auto-generated TypeScript types, GraphQL client, schema (do not edit manually)
- **Content files:** `content/` — Markdown/MDX files managed through TinaCMS admin UI

Pages use a **block-based** composition system. Each page has an array of typed blocks (hero, features, content, testimonial) defined in the page collection schema and rendered by `components/blocks/index.tsx`.

### Component Structure

- `components/blocks/` — Content block components (hero, features, content, testimonial, actions)
- `components/layout/` — Layout wrapper, section theming, container sizing, and `LayoutContext` (React Context for global settings/theme)
- `components/nav/` — Header and footer with navigation
- `components/mdx-components.tsx` — Custom renderers for TinaCMS rich-text/MDX content

### Styling

- Tailwind CSS with extensive custom theme in `tailwind.config.ts` (custom breakpoints, colors, fonts)
- Dark mode via `next-themes` with class-based strategy (`darkMode: "class"`)
- Utility: `lib/utils.ts` exports `cn()` (clsx + tailwind-merge)
- Custom fonts: Nunito and Lato (Google Fonts, loaded in `app/layout.tsx`)

### Environment Variables

Required for TinaCMS cloud integration:
- `NEXT_PUBLIC_TINA_CLIENT_ID` — TinaCMS project ID
- `TINA_TOKEN` — TinaCMS auth token
- `NEXT_PUBLIC_TINA_BRANCH` — Git branch for content API

## CI/CD

GitHub Actions on PR: builds with Node 18 + pnpm v9. Dependabot monitors TinaCMS dependency updates daily.

## SEO

Site URL: `https://www.praktijknoortje.nl`. `lib/seo.ts` is the single source for `SITE_URL`, business NAP details (`BUSINESS`, used by the JSON-LD and the footer), default title/description/OG image, and `buildMetadata()`. Always build page metadata through `buildMetadata()`: Next.js merges `openGraph`/`twitter` shallowly, and an explicit `title: undefined` drops the `<title>` tag entirely.

### Metadata

- Root metadata with title template (`%s | Praktijk Noortje`) in `app/layout.tsx`
- Per-page dynamic metadata via `generateMetadata()` in `app/[...filename]/page.tsx` — reads `seoTitle` and `seoDescription` fields from TinaCMS, falls back to page title
- Per-post dynamic metadata via `generateMetadata()` in `app/posts/[...filename]/page.tsx`
- Static metadata for the blog listing in `app/posts/page.tsx`
- Open Graph (`og:*`, locale `nl_NL`) and Twitter Card tags on all pages
- Canonical URLs on every page via `alternates.canonical` (resolves `/` → `/home` rewrite duplicate)

### Structured Data (JSON-LD)

- `@graph` in root layout (`app/layout.tsx`): `LocalBusiness` (full address, phone, email, prices via `makesOffer`), `Person` (Noortje, founder), `WebSite`
- `BreadcrumbList` schema on each page (`app/[...filename]/page.tsx`)
- `BlogPosting` schema on post pages (`app/posts/[...filename]/page.tsx`) — title, author, date, image

### CMS SEO Fields

The page collection (`tina/collection/page.ts`) has `seoTitle` and `seoDescription` fields that editors can set per page. When empty, the page title is used as fallback.

### Sitemap & Robots

- Dynamic sitemap at `app/sitemap.ts` — queries TinaCMS for all pages and posts; `/posts` is only listed (and only indexable) once at least one post exists
- `public/robots.txt` — allows crawling, disallows `/admin`, references sitemap

### Heading Hierarchy

- Hero block headline (`components/blocks/hero.tsx`) uses `<h1>` — one per page
- Hero tagline uses `<p>` (not a heading)
- Header logo (`components/nav/header.tsx`) uses `<div>` with descriptive alt text (not a heading)
- Post titles (`app/posts/[...filename]/client-page.tsx`) use `<h1>`
- Content pages get their `<h1>` from a leading `# ` heading in the markdown body

### Content conventions

Each content page starts its body with a single `# ` heading (rendered as the page's `<h1>`); sections use `##`/`###`. Images need descriptive Dutch alt text. Pages cross-link to aanbod / tarieven / contact.

Each treatment has its own page (`emdr`, `hypnotherapie`, `hypnotic-heaven`, `stoppen-met-roken`), so each can rank for its own search; `aanbod` is the overview hub linking to them. A new treatment page must also be added to `TREATMENT_PAGES` in `lib/seo.ts` (breadcrumb Home › Aanbod › X) and to `makesOffer` in `app/layout.tsx`.

### Performance

- `components/blocks/index.tsx` code-splits the Features and Testimonial blocks with `next/dynamic`: Features pulls in the full BoxIcons set (~1 MB). Don't import them statically.
- `components/mermaid-renderer.tsx` imports `mermaid` lazily inside the effect. Keep it that way.
- Rich-text images render through `components/markdown-image.tsx` (`next/image`), because uploads are ~1.5 MB originals.
- `public/og-image.jpg` is a 1200x630 crop used as the default social preview image.
