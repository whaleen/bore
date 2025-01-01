# Local Development

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

## Development Environment Setup

1. Install dependencies from monorepo root:

```bash
pnpm install
```

2. Set up your database URL in `apps/web/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/bore"
```

## Running the Development Servers

You'll need two terminal windows to run the development environment:

### Terminal 1: Vite Dev Server

```bash
cd apps/web
pnpm run dev:vite
```

This starts the frontend on http://localhost:5173 with hot module reloading.

### Terminal 2: Netlify Functions

```bash
cd apps/web
netlify functions:serve
```

This starts the API functions server on http://localhost:9999.

The frontend will automatically proxy API requests from port 5173 to the functions running on 9999.

## Important Notes

- Do not use `pnpm run dev:web` from the monorepo root - this won't work properly with the function servers
- Always run the dev servers from within `apps/web`
- Make sure both servers are running for full functionality
- Any changes to Prisma schema require running `prisma generate` before restarting servers

## Troubleshooting

- If API calls fail, verify both servers are running and the proxy port in `vite.config.js` matches the Netlify Functions port (9999)
- If experiencing workspace dependency issues, run `pnpm install` from the monorepo root
