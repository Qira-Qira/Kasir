alter table public.transactions
  add column if not exists is_completed boolean not null default false;

create policy "Allow public update access to transaction completion status"
on public.transactions for update
using (true)
with check (true);
