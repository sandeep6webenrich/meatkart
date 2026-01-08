# Vercel Deployment Guide

This project uses Supabase for the database. When deploying to Vercel, configure the Environment Variables so runtime uses the Transaction Pooler and builds do not depend on database connectivity.

## Environment Variables

### DATABASE_URL (Runtime)
- **Use Supabase Transaction Pooler (Port 6543)** for serverless reliability.
- **Value:** `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1`

### DIRECT_URL (Migrations)
- **Use Direct Connection (Port 5432)** for migrations and local tooling.
- **Value:** `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?sslmode=require`

## Troubleshooting

### "Can't reach database server" during Build
- The home page and sitemap are marked dynamic and no longer query the DB during build.
- If runtime still cannot reach the DB, confirm `DATABASE_URL` uses port `6543` and includes `?pgbouncer=true&sslmode=require&connection_limit=1`.
- Verify connectivity by calling the health endpoint `/api/health/db` on your deployment; it should return `{ ok: true, products: <number> }`.
