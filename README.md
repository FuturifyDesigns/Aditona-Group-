# Aditona Group Website

React + Vite marketing site for **Aditona Group Proprietary Limited**.

**Live (GitHub Pages):** https://futurifydesigns.github.io/Aditona-Group-/

## Stack

- React 19 + Vite 8 + React Router
- GSAP + `@gsap/react` + ScrollTrigger (scroll storytelling, typography reveals, hero slideshow)
- Supabase (enquiries, live CMS copy/cards, media storage)
- Brand: Inter, monochrome `#F4F4F4` → `#1A1A1B`

## Develop

```bash
npm install
npm run dev
```

Open the URL Vite prints (base path is `/Aditona-Group-/`).

## Deploy

GitHub Actions builds and deploys `dist/` on every push to `main` (`.github/workflows/deploy.yml`).

In the repo: **Settings → Pages → Source → GitHub Actions**.

Manual local publish (optional):

```bash
npm run deploy
```

## Config

Edit `src/lib/config.js`:

- `whatsapp` — digits only, country code included
- `emails` — `@aditona.com` addresses
- Supabase URL / anon key (public)

## Admin & live CMS

Admin email: **admin@aditona.com**  
Password was set during Supabase setup — change it in the Supabase Auth dashboard if needed. Do not commit passwords.

1. Sign in at `/admin` (or `/admin/login`).
2. Use the admin tabs: **Enquiries** | **Copy** | **Cards** | **Projects**.
3. On the public site, the fixed bar appears when you are authenticated. Toggle **Edit Live: ON**.
4. Clickable fields and buttons show a pencil badge. Clicking them opens an editor and **does not navigate** (buttons/links are intercepted while Edit Live is on).
5. Images can be replaced via file picker (uploads to the public `media` storage bucket).
6. Toggle Edit Live off (or log out) to restore normal navigation.

### Content keys (seed / defaults)

Hero & nav: `nav.cta`, `hero.eyebrow`, `hero.headline`, `hero.body`, `hero.cta_quote`, `hero.cta_enquiry`, `hero.tagline`  
Home sections: `home.divisions_*`, `home.work_*`  
CTA band: `cta.title`, `cta.body`, `cta.quote`, `cta.enquiry`

Card collections: `home_divisions`, `home_work`, `portfolio`, `insights`. If a collection has published rows in `cms_cards`, the homepage uses those instead of hardcoded fallbacks.

## Enquiries

Public forms insert into Supabase `enquiries` (RLS: public insert). Track status, follow-up date, quotation sent, converted, and notes in **Admin → Enquiries**.

## Notes

- Proper paths (`/about`, `/event-solutions`, …) — no hash router
- Mobile: tap highlight removed; compact spacing
- Cloudflare + custom domain can sit in front later; keep the same build
- Only the Supabase anon key belongs in the client; never commit service-role keys or passwords
