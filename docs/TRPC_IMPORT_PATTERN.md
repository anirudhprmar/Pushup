# tRPC Import Pattern

## Single Source of Truth

All components should import the tRPC client from `~/lib/api`:

```tsx
import { api } from "~/lib/api";
```

## Why This Pattern?

### ✅ Benefits

1. **Consistency** - One import path across the entire codebase
2. **Simplicity** - Developers don't need to remember multiple import paths
3. **Clean** - Shorter import path (`~/lib/api` vs `~/trpc/react`)
4. **Separation** - Keep tRPC setup details in `~/trpc/` folder, expose only the client

### 📁 File Structure

```
src/
├── lib/
│   └── api.ts                 ← Import from here in components
├── trpc/
│   ├── react.tsx              ← Provider setup (don't import directly)
│   ├── server.ts              ← Server-side tRPC
│   └── query-client.ts        ← Query client config
└── app/
    └── layout.tsx             ← Only place that imports TRPCReactProvider
```

## Usage Examples

### ✅ Correct Usage

```tsx
// In any component
import { api } from "~/lib/api";

export default function MyComponent() {
  const { data } = api.user.me.useQuery();
  return <div>{data?.name}</div>;
}
```

### ❌ Incorrect Usage

```tsx
// Don't do this
import { api } from "~/trpc/react";
```

## Exception: Layout File

The root layout is the **only** file that should import from `~/trpc/react`:

```tsx
// src/app/layout.tsx
import { TRPCReactProvider } from "~/trpc/react"; // ✅ OK here

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
```

## Implementation Details

### `~/lib/api.ts`

```typescript
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "~/server/api/root";

export const api = createTRPCReact<AppRouter>();
```

This file:

- Creates the tRPC React client
- Imports only the **type** of AppRouter (no server code in client bundle)
- Exports a single `api` object for use throughout the app

### `~/trpc/react.tsx`

```typescript
import { api } from "~/lib/api";

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [/* ... */],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
```

This file:

- Imports `api` from `~/lib/api`
- Sets up the provider with links, transformers, etc.
- Exports only the `TRPCReactProvider` component

## Migration Guide

If you have files importing from `~/trpc/react`, update them:

```diff
- import { api } from "~/trpc/react";
+ import { api } from "~/lib/api";
```

## Summary

- **Components**: Import from `~/lib/api`
- **Layout**: Import `TRPCReactProvider` from `~/trpc/react`
- **Server**: Import from `~/trpc/server`

This keeps your imports clean and consistent! 🎯
