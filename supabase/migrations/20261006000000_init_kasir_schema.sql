create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(12,2) not null default 0,
  category text not null default 'Minuman',
  created_by text not null default 'admin',
  created_at timestamp with time zone not null default now()
);

create table if not exists public.users (
  username text primary key,
  password text not null,
  name text not null,
  role text not null default 'kasir' check (role in ('admin', 'investor', 'kasir')),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.transactions (
  id text primary key,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  payment_method text not null,
  amount_paid numeric(12,2) not null default 0,
  order_type text not null default 'Dine In',
  created_at timestamp with time zone not null default now()
);

create table if not exists public.raw_materials (
  id text primary key,
  name text not null,
  stock_grams numeric(12,2) not null default 0,
  unit text not null default 'gram' check (unit in ('gram', 'ml')),
  hpp_per_unit numeric(12,2) not null default 0,
  created_at timestamp with time zone not null default now()
);

alter table public.products enable row level security;
alter table public.users enable row level security;
alter table public.transactions enable row level security;
alter table public.raw_materials enable row level security;

create policy "Allow public read access to products"
  on public.products for select
  using (true);

create policy "Allow public write access to products"
  on public.products for insert with check (true);

create policy "Allow public update access to products"
  on public.products for update using (true) with check (true);

create policy "Allow public delete access to products"
  on public.products for delete using (true);

create policy "Allow public read access to users"
  on public.users for select
  using (true);

create policy "Allow public write access to users"
  on public.users for insert with check (true);

create policy "Allow public update access to users"
  on public.users for update using (true) with check (true);

create policy "Allow public delete access to users"
  on public.users for delete using (true);

create policy "Allow public read access to transactions"
  on public.transactions for select
  using (true);

create policy "Allow public write access to transactions"
  on public.transactions for insert with check (true);

create policy "Allow public update access to transactions"
  on public.transactions for update using (true) with check (true);

create policy "Allow public delete access to transactions"
  on public.transactions for delete using (true);

create policy "Allow public read access to raw_materials"
  on public.raw_materials for select
  using (true);

create policy "Allow public write access to raw_materials"
  on public.raw_materials for insert with check (true);

create policy "Allow public update access to raw_materials"
  on public.raw_materials for update using (true) with check (true);

create policy "Allow public delete access to raw_materials"
  on public.raw_materials for delete using (true);

insert into public.products (id, name, price, category, created_by)
values
  ('1', 'Espresso', 15000, 'Minuman', 'admin'),
  ('2', 'Cappuccino', 25000, 'Minuman', 'admin'),
  ('3', 'Latte', 28000, 'Minuman', 'admin'),
  ('4', 'Americano', 20000, 'Minuman', 'admin'),
  ('5', 'Croissant', 18000, 'Snack', 'admin'),
  ('6', 'Chocolate Cake', 35000, 'Snack', 'admin'),
  ('7', 'Blueberry Muffin', 22000, 'Snack', 'admin'),
  ('8', 'Green Tea', 15000, 'Minuman', 'admin'),
  ('9', 'Iced Tea', 12000, 'Minuman', 'admin'),
  ('10', 'Sandwich', 30000, 'Makanan', 'admin'),
  ('11', 'Smoothie Bowl', 38000, 'Makanan', 'admin'),
  ('12', 'Orange Juice', 18000, 'Minuman', 'admin')
on conflict (id) do nothing;

insert into public.users (username, password, name, role)
values
  ('admin', 'admin123', 'Admin POS', 'admin'),
  ('investor', 'investor123', 'Investor Team', 'investor'),
  ('kasir', 'kasir123', 'Kasir Outlet', 'kasir')
on conflict (username) do nothing;

insert into public.raw_materials (id, name, stock_grams, unit, hpp_per_unit)
values
  ('raw-bubuk-kopi', 'Bubuk Kopi', 5000, 'gram', 2000),
  ('raw-susu', 'Susu', 2500, 'ml', 3500),
  ('raw-gula-aren', 'Gula Aren', 2000, 'gram', 1500)
on conflict (id) do nothing;
