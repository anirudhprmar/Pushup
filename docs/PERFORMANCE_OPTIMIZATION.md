# Performance Optimization Guide

## Current Performance Analysis

### Observed Timings

```
[TRPC] habit.habits took 476ms to execute
[TRPC] user.me took 1029ms to execute
Total request: 8373ms
```

### Root Causes

1. **Geographic Latency** 🌍
   - Your Neon database is in `us-east-1` (Virginia, USA)
   - You're in India (IST timezone)
   - **Round-trip latency: ~300-500ms per query**
   - This is the biggest bottleneck!

2. **Cold Start**
   - First request after server restart is always slower
   - Includes: compilation, database connection, session verification

3. **Multiple Database Queries**
   - `user.me`: 1 DB query (SELECT user)
   - `habit.habits`: 1 DB query (SELECT habits)
   - Session verification: 1-2 DB queries
   - **Total: 3-4 database round trips to US East!**

---

## Immediate Optimizations

### 1. ✅ Use Neon's Connection Pooler (Already Configured)

Your connection string already uses `-pooler`:

```
ep-long-mode-ah5vq1iy-pooler.c-3.us-east-1.aws.neon.tech
```

This is good! It reduces connection overhead.

### 2. 🚀 Optimize Database Queries

#### A. Use Drizzle's Relational Query API

**Current approach** (multiple queries):

```typescript
// user.router.ts
const [userInfo] = await ctx.db
  .select()
  .from(user)
  .where(eq(user.id, ctx.userId));

// habit.router.ts
const data = await ctx.db
  .select()
  .from(habit)
  .where(eq(habit.userId, ctx.userId));
```

**Optimized approach** (single query with joins):

```typescript
// Fetch user with habits in ONE query
const userWithHabits = await ctx.db.query.user.findFirst({
  where: eq(user.id, ctx.userId),
  with: {
    habits: true, // Automatically joins habits
  },
});
```

#### B. Add Database Indexes

Create indexes on frequently queried columns:

```sql
-- Add to your migration
CREATE INDEX IF NOT EXISTS idx_habit_user_id ON habit(user_id);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
```

In Drizzle schema:

```typescript
export const habit = pgTable(
  "habit",
  {
    // ... columns
  },
  (table) => ({
    userIdIdx: index("idx_habit_user_id").on(table.userId),
  }),
);
```

### 3. 🌐 Move Database Closer to You

**Option A: Change Neon Region** (Recommended)

- Create a new Neon project in a closer region
- Available regions: `eu-central-1` (Frankfurt), `ap-southeast-1` (Singapore)
- Singapore would reduce latency from 500ms to ~50-100ms

**Option B: Use Supabase** (You have it commented out)

- Supabase has regions in Singapore
- Would significantly reduce latency

**Option C: Local Development Database**

- Use Docker for local Postgres during development
- Zero latency for dev work!

```bash
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: pushup
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Then use:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pushup"
```

### 4. 📦 Optimize Session Handling

The session cache is working, but we can improve it:

```typescript
// In protectedProcedure, avoid re-querying user data
export const protectedProcedure = t.procedure
  .use(cachedSessionMiddleware)
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // User data is already in session, no need to query DB again!
    return next({
      ctx: {
        session: ctx.session,
        userId: ctx.session.user.id,
        user: ctx.session.user, // ← Use session data instead of DB query
      },
    });
  });
```

Then in `user.router.ts`:

```typescript
export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    // If session has all user data, just return it
    if (ctx.user) {
      return ctx.user;
    }

    // Otherwise query DB (fallback)
    const [userInfo] = await ctx.db
      .select()
      .from(user)
      .where(eq(user.id, ctx.userId));

    if (!userInfo) {
      throw new Error("User not found");
    }

    return userInfo;
  }),
});
```

### 5. ⚡ Enable HTTP/2 and Compression

In `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const config = {
  compress: true, // Enable gzip compression
  // ... other config
};
```

---

## Expected Performance After Optimizations

### With Current Setup (Neon US East)

```
First request (cold start): ~1000ms
Subsequent requests: ~200-400ms (with cache)
```

### With Local Database (Development)

```
First request: ~100-200ms
Subsequent requests: ~10-30ms ✨
```

### With Closer Database Region (Singapore)

```
First request: ~200-300ms
Subsequent requests: ~50-100ms
```

---

## Quick Wins (Implement Now)

### 1. Remove `user.me` Query from Home Page

You're not using `userInfo` in the home page anymore (you removed it). Remove the query:

```typescript
// src/app/(dashboard)/home/page.tsx
// ❌ Remove this - not needed!
// const {data:userInfo,isLoading:loadingUserInfo,error:userInfoError} = api.user.me.useQuery()

// ✅ Only fetch habits
const {
  data: userHabits,
  isLoading: loadingUserHabits,
  error: userHabitsError,
} = api.habit.habits.useQuery();
```

This will cut your request time in half!

### 2. Add Indexes

Run this migration:

```sql
CREATE INDEX IF NOT EXISTS idx_habit_user_id ON habit(user_id);
```

### 3. Use Local Database for Development

Set up Docker Postgres locally to eliminate network latency during development.

---

## Monitoring

Add more detailed logging:

```typescript
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  const result = await next();

  const end = Date.now();
  const duration = end - start;

  // Color code based on performance
  const color =
    duration < 50 ? "\x1b[32m" : duration < 200 ? "\x1b[33m" : "\x1b[31m";
  console.log(`${color}[TRPC] ${path} took ${duration}ms\x1b[0m`);

  return result;
});
```

---

## Summary

**Immediate actions:**

1. ✅ Remove unused `user.me` query from home page
2. ✅ Add database indexes
3. ✅ Use local Postgres for development

**Long-term:**

1. Move Neon database to Singapore region
2. Implement query batching/joining
3. Add Redis caching for frequently accessed data

Your queries will never be "instant" with a database in Virginia when you're in India. The speed of light is the limiting factor! 🌍⚡
