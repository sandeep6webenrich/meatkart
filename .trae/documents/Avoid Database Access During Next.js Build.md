To stop the build from failing due to database connectivity, we’ll ensure the home page renders dynamically at runtime rather than during `next build`, and add a graceful fallback if the database is unreachable.

## Changes
- Mark the home page as dynamic so it is not prerendered and won’t access the database during build.
- Add a try/catch in FeaturedProducts to handle Prisma initialization errors and render an empty state instead of crashing.

## Implementation Details
- In `src/app/page.tsx`, export `dynamic = 'force-dynamic'` and `revalidate = 0`.
- In `src/components/home/FeaturedProducts.tsx`, wrap the Prisma query in a try/catch and default to an empty array on error.

## Expected Outcome
- Vercel builds succeed without trying to reach the database during prerender.
- Runtime requests render the home page and fetch products when the database is reachable.
