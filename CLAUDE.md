# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server
```

No test suite is configured.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Only needed for image uploads (/api/upload-image)
```

## Architecture

Next.js 15 App Router application using TypeScript, Tailwind CSS, and Supabase (PostgreSQL).

### Server vs Client Components

- `app/page.tsx` — async server component; fetches wines from Supabase and passes them to `WineList` as `initialWines`
- `app/admin/page.tsx` — client component (`'use client'`); password-protected CRUD panel
- All components under `app/components/` are client components

### Database

Supabase table: `vinos`. Column names are capitalized (`Id`, `Title`, `Vintage`, `Country`, `Province`, `Variety`, `Points`, `Price`, `Winery`, `Designation`) except `image_url` (lowercase). The Wine TypeScript interface uses lowercase field names, so any query result must be mapped — see the `winesMapped` transform in `app/page.tsx` and `app/admin/page.tsx`.

### Data Flow

1. `app/page.tsx` reads URL search params, builds a `WineFilter`, queries Supabase, maps rows to `Wine[]`, passes to `<WineList initialWines={wines} total={total} />`
2. `WineList` handles client-side pagination, favorites (localStorage), and display
3. `SearchBar` updates URL search params to trigger a server-side re-fetch

### API Route

`app/api/upload-image/route.ts` — accepts `multipart/form-data`, uploads to Supabase Storage bucket `wine-images`, returns the public URL. Uses `SUPABASE_SERVICE_ROLE_KEY`.

### Styling

Custom Tailwind color palette defined in `tailwind.config.js`: `wine-darker`, `wine-dark`, `wine-light`, `burgundy`, `cork-*`. The overall theme is dark with warm wine/burgundy tones.
