alter table public.products
  add column if not exists recipe jsonb not null default '[]'::jsonb,
  add column if not exists addons jsonb not null default '[]'::jsonb;
