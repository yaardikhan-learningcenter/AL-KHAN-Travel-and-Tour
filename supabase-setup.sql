-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
create table if not exists public.erp_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.erp_state enable row level security;

-- Only logged-in users (the ones YOU create) can read/write the books.
drop policy if exists "staff full access" on public.erp_state;
create policy "staff full access" on public.erp_state
  for all to authenticated using (true) with check (true);
-- Anonymous (not logged in) visitors get no access at all.
