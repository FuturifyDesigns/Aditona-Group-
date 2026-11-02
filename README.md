# Aditona Group Website

React + Vite marketing site for **Aditona Group Proprietary Limited**.

**Live (GitHub Pages):** https://futurifydesigns.github.io/Aditona-Group-/

## Stack

- React 19 + Vite 8 + React Router
- GSAP + `@gsap/react` + ScrollTrigger (scroll storytelling, typography reveals, hero slideshow)
- Supabase (enquiry / quote submissions + tracker table)
- Brand: Inter, monochrome `#F4F4F4` → `#1A1A1B`

## Develop

```bash
npm install
npm run dev
```

Open the URL Vite prints (base path is `/Aditona-Group-/`).

## Deploy

```bash
npm run deploy
```

Builds to `dist/`, copies `404.html` for SPA routes, pushes to `gh-pages`.

## Config

Edit `src/lib/config.js`:

- `whatsapp` — digits only, country code included
- `emails` — `@aditona.com` addresses
- Supabase URL / anon key (public)

## Enquiries

Forms insert into Supabase `enquiries` (RLS: public insert only). Track status in the Supabase Table Editor until a private admin UI is added.

## Notes

- Proper paths (`/about`, `/event-solutions`, …) — no hash router
- Mobile: tap highlight removed; compact spacing
- Cloudflare + custom domain can sit in front later; keep the same build
