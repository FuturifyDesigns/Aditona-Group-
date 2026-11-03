-- Testimonials: clients post reviews on the homepage; admin can hide or delete.
-- Run in Supabase Dashboard → SQL Editor → New query → Run.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  company text,
  email text,
  rating smallint not null default 5 check (rating between 1 and 5),
  message text not null,
  is_hidden boolean not null default false,
  user_agent text
);

create index if not exists testimonials_visible_created_idx
  on public.testimonials (created_at desc)
  where is_hidden = false;

alter table public.testimonials enable row level security;

drop policy if exists "Public can read visible testimonials" on public.testimonials;
drop policy if exists "Anon can read visible testimonials" on public.testimonials;
drop policy if exists "Public can insert testimonials" on public.testimonials;
drop policy if exists "Authenticated can read all testimonials" on public.testimonials;
drop policy if exists "Authenticated can update testimonials" on public.testimonials;
drop policy if exists "Authenticated can delete testimonials" on public.testimonials;

create policy "Anon can read visible testimonials"
on public.testimonials
for select
to anon
using (is_hidden = false);

create policy "Authenticated can read all testimonials"
on public.testimonials
for select
to authenticated
using (true);

create policy "Public can insert testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (
  char_length(trim(full_name)) >= 2
  and char_length(trim(message)) >= 10
  and rating between 1 and 5
  and is_hidden = false
);

create policy "Authenticated can update testimonials"
on public.testimonials
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete testimonials"
on public.testimonials
for delete
to authenticated
using (true);

grant select, insert on table public.testimonials to anon, authenticated;
grant update, delete on table public.testimonials to authenticated;
