-- Fix public form 401: allow anonymous inserts into enquiries.
-- Run in Supabase Dashboard → SQL Editor → New query → Run.

alter table public.enquiries enable row level security;

-- Drop old variants if they exist (safe re-run)
drop policy if exists "Public can insert enquiries" on public.enquiries;
drop policy if exists "anon_insert_enquiries" on public.enquiries;
drop policy if exists "Allow public insert enquiries" on public.enquiries;
drop policy if exists "Enable insert for anon" on public.enquiries;

create policy "Public can insert enquiries"
on public.enquiries
for insert
to anon, authenticated
with check (true);

-- Admin read/update (authenticated users only — further limited in app to admin@)
drop policy if exists "Authenticated can read enquiries" on public.enquiries;
drop policy if exists "Authenticated can update enquiries" on public.enquiries;

create policy "Authenticated can read enquiries"
on public.enquiries
for select
to authenticated
using (true);

create policy "Authenticated can update enquiries"
on public.enquiries
for update
to authenticated
using (true)
with check (true);
