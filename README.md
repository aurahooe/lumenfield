# Lumenfield

A small public notebook. Accounts persist through Supabase. Public pieces appear on the wall.

## Local

```bash
cp .env.example .env.local
npm i
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Import the project in Vercel and add those same env vars.
