## Root Cause
- The Shop page queries Prisma at runtime. In Vercel, Prisma connects to Supabase via the transaction pooler port 6543. Your logs show “Can’t reach database server at …:6543”, which typically indicates incorrect/absent env vars or missing PgBouncer parameters when using serverless.

## What We’ll Do
1. **Verify and set Vercel env vars**
   - Set Production env vars exactly as:
     - DATABASE_URL: `postgresql://postgres:<PASSWORD>@db.<PROJECT_ID>.supabase.co:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1`
     - DIRECT_URL:   `postgresql://postgres:<PASSWORD>@db.<PROJECT_ID>.supabase.co:5432/postgres?sslmode=require`
   - Match the repo guidance in VERCEL_DEPLOYMENT.md.
   - Re-deploy after updating env vars.

2. **Confirm Supabase connection pooler**
   - In Supabase Project Settings → Database, copy the “Pooled” connection string (PgBouncer / port 6543).
   - Ensure credentials (user, password, database: `postgres`) are correct.

3. **Runtime verification**
   - Hit the health endpoint to confirm DB connectivity: [route.ts](file:///d:/sandeep/htdocs/united/src/app/api/health/db/route.ts).
   - Then load /shop. The page is already dynamic (`export const dynamic = 'force-dynamic'`).

4. **Improve resilience (optional)**
   - Wrap product/category queries in try/catch on the Shop page to render a friendly fallback if DB is temporarily unreachable.
   - Add minimal logging (server-only) and avoid leaking secrets.

5. **Post-deploy checks**
   - Verify Vercel Production logs show successful Prisma queries.
   - If issues persist, temporarily point DATABASE_URL to port 5432 (non-pooled) for testing, then switch back to 6543 once confirmed.

## Code References
- Prisma schema: [schema.prisma](file:///d:/sandeep/htdocs/united/prisma/schema.prisma)
- Prisma client: [prisma.ts](file:///d:/sandeep/htdocs/united/src/lib/prisma.ts)
- Shop route: [page.tsx](file:///d:/sandeep/htdocs/united/src/app/shop/page.tsx)
- Deployment notes: [VERCEL_DEPLOYMENT.md](file:///d:/sandeep/htdocs/united/VERCEL_DEPLOYMENT.md)
- Health check: [db health route](file:///d:/sandeep/htdocs/united/src/app/api/health/db/route.ts)

## Expected Outcome
- Database connectivity succeeds in Vercel Production.
- Shop page renders categories/products. If the DB is down, the page shows a graceful fallback instead of crashing.