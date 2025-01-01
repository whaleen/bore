# Bore Monorepo

Our web (front-end), and chrome-extension apps are here: `apps/`

### API

Criticial: When we update the Prisma schema, we'll need to update our types.ts in `netlfy/functions` to make sure our API types align with the database changes.

Maybe we will prefix function names using crud conventions like `createUser`, `updateUser`, `deleteUser`, `getUser`, `getUsers` etc.

We may need to refator our endpoints to become more atomic to achieve the above CRUD nameing conventions.

### Development Scripts

web: `pnpm run dev:web` - Run the web app in development mode from the root directory using the root package.json.

chrome-extension: `pnpm dlx vite --config vite.config.js` - Run vite with custom config file from teh chrome-extension directory directly. The fancy turbo mode running everything from root is a good way to drive yourself crazy.
