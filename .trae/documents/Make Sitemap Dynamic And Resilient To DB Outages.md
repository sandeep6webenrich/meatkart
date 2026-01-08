To stop builds failing on /sitemap.xml, we’ll prevent database access during prerender and add a graceful fallback.

## Changes
- Mark the sitemap route as dynamic so it renders at runtime instead of build.
- Wrap Prisma queries in try/catch and return a minimal static sitemap if the database is unreachable.
- Optionally set a short `revalidate` (e.g., 60s) so the sitemap is cached but refreshed frequently.

## Implementation Details
- In `src/app/sitemap.ts`:
  - Add `export const dynamic = 'force-dynamic'` and `export const revalidate = 60`.
  - Wrap `prisma.product.findMany` and `prisma.category.findMany` in try/catch; on error, return only static routes.

## Expected Outcome
- Vercel builds succeed without contacting the database.
- The sitemap still includes dynamic product/category URLs when the database is reachable at runtime; otherwise it serves a safe minimal sitemap.