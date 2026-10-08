create table if not exists public.shift_sessions (
  id text primary key,
  status text not null default 'CLOSED' check (status in ('OPEN', 'CLOSED')),
  opened_at timestamp with time zone,
  closed_at timestamp with time zone,
  starting_cash numeric(12,2) not null default 0,
  cash_sales numeric(12,2) not null default 0,
  petty_cash_out numeric(12,2) not null default 0,
  cash_in numeric(12,2) not null default 0,
  expected_cash numeric(12,2) not null default 0,
  actual_cash numeric(12,2) not null default 0,
  difference numeric(12,2) not null default 0,
  note text not null default '',
  created_at timestamp with time zone not null default now()
);

alter table public.shift_sessions enable row level security;

create policy "Allow public read access to shift_sessions"
  on public.shift_sessions for select
  using (true);

create policy "Allow public write access to shift_sessions"
  on public.shift_sessions for insert with check (true);

create policy "Allow public update access to shift_sessions"
  on public.shift_sessions for update using (true) with check (true);

create policy "Allow public delete access to shift_sessions"
  on public.shift_sessions for delete using (true);
