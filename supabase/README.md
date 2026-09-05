# Supabase Migrations

This directory contains SQL migration files for the Saathi Vyapar database.

## Migration Files

| File | Description |
|------|-------------|
| `001_init.sql` | Initial schema — creates all tables and indexes |
| `002_rls_policies.sql` | Row Level Security policies for all tables |

## Running Migrations

### Option 1: Supabase CLI (Recommended)

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
3. Push migrations:
   ```bash
   supabase db push
   ```

### Option 2: SQL Editor (Dashboard)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Create a **New Query**
4. Paste the contents of each migration file in order (001 first, then 002)
5. Click **Run**

### Option 3: psql / direct connection

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/001_init.sql \
  -f supabase/migrations/002_rls_policies.sql
```

## Seed Data

After running migrations, seed the schemes table:

```bash
psql "postgresql://..." -f supabase/seed/schemes.sql
```

Or paste `supabase/seed/schemes.sql` into the SQL Editor.

## Notes

- Migrations are **idempotent** — all CREATE statements use `IF NOT EXISTS`
- Always run migrations in order (001 → 002)
- Do NOT run seed data before running migrations
