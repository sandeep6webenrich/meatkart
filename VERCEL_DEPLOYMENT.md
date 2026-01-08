# Vercel Deployment Guide

This project uses Supabase for the database. When deploying to Vercel, you need to configure the Environment Variables correctly to ensure the build process can connect to the database.

## Environment Variables

### DATABASE_URL

**Important:** For Vercel deployments, it is recommended to use the **Direct Connection** string (Port 5432) instead of the Transaction Pooler (Port 6543) for the `DATABASE_URL`, or ensure the Pooler is reachable.

If you encounter the error `Can't reach database server at ...:6543`, switch to the Direct URL.

**Recommended Configuration for Vercel:**
- **Value:** `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`
- **Note:** Do NOT include `?pgbouncer=true` when using port 5432.

### DIRECT_URL

This variable is used for migrations and should also point to the direct connection (Port 5432).

- **Value:** `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

## Troubleshooting

### "Can't reach database server" during Build

If the build fails during `Generating static pages` with a connection error:
1.  Go to Vercel Dashboard -> Settings -> Environment Variables.
2.  Update `DATABASE_URL` to use port `5432`.
3.  Redeploy.
