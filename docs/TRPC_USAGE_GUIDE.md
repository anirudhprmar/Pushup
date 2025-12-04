# tRPC Usage Guide

This guide explains how to properly use tRPC in this T3 Stack application for type-safe, efficient data fetching.

## Table of Contents

1. [Why tRPC?](#why-trpc)
2. [Client-Side Usage](#client-side-usage)
3. [Server-Side Usage](#server-side-usage)
4. [Creating New Procedures](#creating-new-procedures)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

---

## Why tRPC?

tRPC provides:

- **End-to-end type safety** - TypeScript types flow from server to client automatically
- **No code generation** - Types are inferred directly from your API
- **Automatic caching** - Built on React Query for smart data management
- **Optimistic updates** - Update UI before server responds
- **Request batching** - Multiple queries combined into one HTTP request

---

## Client-Side Usage

### Basic Query Hook

Use `useQuery` for fetching data in client components:

```tsx
"use client";

import { api } from "~/trpc/react";

export default function UserProfile() {
  const { data, isLoading, error } = api.user.me.useQuery(undefined, {
    retry: 1,
    staleTime: 5000, // Data fresh for 5 seconds
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello, {data?.name}!</div>;
}
```

### Mutation Hook

Use `useMutation` for creating, updating, or deleting data:

```tsx
"use client";

import { api } from "~/trpc/react";

export default function CreateHabitForm() {
  const utils = api.useUtils();

  const createHabit = api.habit.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch habits list
      utils.habit.habits.invalidate();
    },
    onError: (error) => {
      console.error("Failed to create habit:", error);
    },
  });

  const handleSubmit = (data: { name: string; description: string }) => {
    createHabit.mutate(data);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({ name: "Exercise", description: "Daily workout" });
      }}
    >
      <button type="submit" disabled={createHabit.isPending}>
        {createHabit.isPending ? "Creating..." : "Create Habit"}
      </button>
    </form>
  );
}
```

### Optimistic Updates

Update UI immediately before server responds:

```tsx
const deleteHabit = api.habit.delete.useMutation({
  onMutate: async (habitId) => {
    // Cancel outgoing refetches
    await utils.habit.habits.cancel();

    // Snapshot previous value
    const previousHabits = utils.habit.habits.getData();

    // Optimistically update to new value
    utils.habit.habits.setData(undefined, (old) =>
      old?.filter((h) => h.id !== habitId),
    );

    return { previousHabits };
  },
  onError: (err, habitId, context) => {
    // Rollback on error
    utils.habit.habits.setData(undefined, context?.previousHabits);
  },
  onSettled: () => {
    // Refetch after error or success
    utils.habit.habits.invalidate();
  },
});
```

---

## Server-Side Usage

### Server Components (Recommended)

Fetch data directly in Server Components for better performance:

```tsx
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const user = await api.user.me();
  const habits = await api.habit.habits();

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <HabitList habits={habits} />
    </div>
  );
}
```

### Server Actions

Use tRPC in Server Actions for form submissions:

```tsx
"use server";

import { api } from "~/trpc/server";

export async function createHabitAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const habit = await api.habit.create({ name, description });

  revalidatePath("/dashboard");
  return habit;
}
```

---

## Creating New Procedures

### 1. Define the Router

Create a new router file in `src/server/api/routers/`:

```typescript
// src/server/api/routers/habit.router.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { habit } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const habitRouter = createTRPCRouter({
  // Query: Fetch all habits for current user
  habits: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(habit).where(eq(habit.userId, ctx.userId));
  }),

  // Query with input: Fetch single habit by ID
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [habitData] = await ctx.db
        .select()
        .from(habit)
        .where(eq(habit.id, input.id));

      if (!habitData) {
        throw new Error("Habit not found");
      }

      return habitData;
    }),

  // Mutation: Create new habit
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newHabit] = await ctx.db
        .insert(habit)
        .values({
          userId: ctx.userId,
          name: input.name,
          description: input.description,
        })
        .returning();

      return newHabit;
    }),

  // Mutation: Delete habit
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(habit).where(eq(habit.id, input.id));

      return { success: true };
    }),
});
```

### 2. Register in Root Router

Add your router to `src/server/api/root.ts`:

```typescript
import { habitRouter } from "./routers/habit.router";

export const appRouter = createTRPCRouter({
  user: userRouter,
  habit: habitRouter, // ← Add here
});
```

### 3. Use in Client

TypeScript will automatically know about your new procedures:

```tsx
const habits = api.habit.habits.useQuery();
const createHabit = api.habit.create.useMutation();
```

---

## Best Practices

### ✅ DO

1. **Use Server Components when possible**

   ```tsx
   // ✅ Good: Fetch in Server Component
   export default async function Page() {
     const data = await api.user.me();
     return <ClientComponent data={data} />;
   }
   ```

2. **Use protected procedures for authenticated routes**

   ```typescript
   // ✅ Good: Requires authentication
   export const userRouter = createTRPCRouter({
     me: protectedProcedure.query(({ ctx }) => {
       // ctx.userId is guaranteed to exist
       return ctx.db.query.user.findFirst({
         where: eq(user.id, ctx.userId),
       });
     }),
   });
   ```

3. **Validate inputs with Zod**

   ```typescript
   // ✅ Good: Type-safe input validation
   create: protectedProcedure
     .input(
       z.object({
         name: z.string().min(1).max(100),
         email: z.string().email(),
       }),
     )
     .mutation(({ input }) => {
       // input is fully typed and validated
     });
   ```

4. **Configure staleTime to match your cache strategy**
   ```tsx
   // ✅ Good: Matches 5-second session cache
   const { data } = api.user.me.useQuery(undefined, {
     staleTime: 5000,
   });
   ```

### ❌ DON'T

1. **Don't use useEffect for data fetching**

   ```tsx
   // ❌ Bad: Manual fetching with useEffect
   useEffect(() => {
     fetch("/api/user")
       .then((r) => r.json())
       .then(setUser);
   }, []);

   // ✅ Good: Use tRPC query hook
   const { data: user } = api.user.me.useQuery();
   ```

2. **Don't create duplicate tRPC clients**

   ```tsx
   // ❌ Bad: Creating new client instance
   import { createTRPCReact } from "@trpc/react-query";
   export const api = createTRPCReact<AppRouter>();

   // ✅ Good: Use existing client
   import { api } from "~/trpc/react";
   ```

3. **Don't skip input validation**

   ```typescript
   // ❌ Bad: No input validation
   delete: protectedProcedure
     .mutation(({ input }) => {
       // input is 'any' - not type-safe!
     })

   // ✅ Good: Validated input
   delete: protectedProcedure
     .input(z.object({ id: z.string() }))
     .mutation(({ input }) => {
       // input.id is string
     })
   ```

4. **Don't forget to invalidate queries after mutations**

   ```tsx
   // ❌ Bad: UI won't update
   const create = api.habit.create.useMutation();

   // ✅ Good: Invalidate to refetch
   const utils = api.useUtils();
   const create = api.habit.create.useMutation({
     onSuccess: () => utils.habit.habits.invalidate(),
   });
   ```

---

## Common Patterns

### Loading States

```tsx
const { data, isLoading, isFetching, isError } = api.user.me.useQuery();

// isLoading: First load
// isFetching: Any fetch (including background refetch)
// isError: Query failed
```

### Dependent Queries

```tsx
const { data: user } = api.user.me.useQuery();

const { data: habits } = api.habit.habits.useQuery(undefined, {
  enabled: !!user, // Only run when user exists
});
```

### Parallel Queries

```tsx
// These run in parallel automatically
const user = api.user.me.useQuery();
const habits = api.habit.habits.useQuery();
const stats = api.stats.overview.useQuery();

// All queries are batched into a single HTTP request!
```

### Infinite Queries

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  api.habit.infinite.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
```

### Prefetching

```tsx
"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function HabitList() {
  const router = useRouter();
  const utils = api.useUtils();

  const handleHover = (habitId: string) => {
    // Prefetch habit details on hover
    utils.habit.byId.prefetch({ id: habitId });
  };

  return <div onMouseEnter={() => handleHover("123")}>Hover to prefetch</div>;
}
```

---

## Performance Tips

1. **Use staleTime wisely** - Reduce unnecessary refetches
2. **Enable request batching** - Already configured in `~/trpc/react.tsx`
3. **Implement session caching** - Already configured in `~/server/api/trpc.ts`
4. **Use Server Components** - Fetch data on server when possible
5. **Invalidate selectively** - Only invalidate queries that changed

---

## Debugging

### Enable tRPC Logger

Already enabled in development mode in `~/trpc/react.tsx`:

```typescript
loggerLink({
  enabled: (op) =>
    process.env.NODE_ENV === "development" ||
    (op.direction === "down" && op.result instanceof Error),
});
```

### Check Network Tab

tRPC requests go to `/api/trpc`. Look for:

- Batched requests (multiple procedures in one request)
- Response times
- Error messages

### React Query DevTools

Install for visual debugging:

```bash
npm install @tanstack/react-query-devtools
```

Add to layout:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<TRPCReactProvider>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</TRPCReactProvider>;
```

---

## Summary

- **Always use `~/trpc/react`** for client-side tRPC
- **Prefer Server Components** for initial data fetching
- **Use `useQuery`** for reads, `useMutation` for writes
- **Validate inputs** with Zod schemas
- **Invalidate queries** after mutations
- **Configure caching** with `staleTime` and `cacheTime`
- **Leverage TypeScript** - let types guide you!

For more information, see:

- [tRPC Documentation](https://trpc.io)
- [React Query Documentation](https://tanstack.com/query/latest)
- [T3 Stack Documentation](https://create.t3.gg)
