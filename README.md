# Kasir POS

A Vite + React POS app with local mock data and Supabase-ready data layer.

## Supabase setup

1. Create a new project in Supabase.
2. Open SQL Editor and run the migration in [supabase/migrations/20261006000000_init_kasir_schema.sql](supabase/migrations/20261006000000_init_kasir_schema.sql).
3. Copy [.env.example](.env.example) to `.env.local` and fill in your project values:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Make sure your Supabase project has the `products`, `users`, and `transactions` tables created by the migration.
5. Start the app:

```bash
npm run dev
```

## Notes

- If the Supabase environment variables are not configured, the app will automatically fall back to the existing mock data so local development still works.
- The app data layer checks the database first and then persists product/user edits back to Supabase when available.
