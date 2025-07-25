# Local Development

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

## Development Environment Setup

1. Install dependencies from monorepo root:

```bash
npm install
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
npm run dev
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

- You can also use `npm run dev:web` from the monorepo root which will start the full development environment
- Make sure both servers are running for full functionality  
- Any changes to Prisma schema require running `prisma generate` before restarting servers

## Troubleshooting

- If API calls fail, verify both servers are running and the proxy port in `vite.config.js` matches the Netlify Functions port (9999)
- If experiencing workspace dependency issues, run `npm install` from the monorepo root
