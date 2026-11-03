# Aditona Group Website

React + Vite marketing site for **Aditona Group Proprietary Limited**.

**Live:** https://aditona.com

## Stack

- React 19 + Vite 8 + React Router
- GSAP + `@gsap/react` + ScrollTrigger
- Supabase (enquiries, live CMS copy/cards, media storage)
- Self-hosted Inter Variable (no third-party font CDN)

## Develop

```bash
npm install
npm run dev
```

## Deploy

CI builds and publishes `dist/` on every push to `main` (see `.github/workflows/deploy.yml`).

```bash
npm run build
```

## Config

Edit `src/lib/config.js`:

- `whatsapp` — digits only, country code included
- `emails` — `@aditona.com` addresses
- Supabase URL / anon key (public)

## Admin & live CMS

Admin email: **admin@aditona.com** only (other accounts are signed out automatically).  
Change the password in the Supabase Auth dashboard if needed. Do not commit passwords.

1. Sign in at `/admin` (or `/admin/login`) with `admin@aditona.com`.
2. Use the admin tabs: **Enquiries** | **Copy** | **Cards** | **Projects**.
3. On the public site, the fixed bar appears when you are authenticated. Toggle **Edit Live: ON**.
4. Clickable fields and buttons show a pencil badge.
5. Images can be replaced via file picker (uploads to the public `media` storage bucket).

## Enquiries

Public forms insert into Supabase `enquiries` (RLS: public insert). Track status in **Admin → Enquiries**.

## Security notes

- Production builds omit source maps and strip `console` / `debugger`
- Security contact: `/.well-known/security.txt`
- Edge CDN applies CSP, HSTS, framing, and Permissions-Policy headers
- Only the Supabase anon key belongs in the client; never commit service-role keys
