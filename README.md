# Bore

**Web3-enabled proxy/VPN node management platform** with Solana authentication, Chrome extension, and cloud infrastructure integration.

## Overview

Bore is a decentralized proxy/VPN node management system that enables users to:

- **Manage Proxy Nodes**: Deploy, configure, and monitor proxy servers across multiple regions
- **Web3 Authentication**: Secure login using Solana wallet integration (Phantom wallet support)
- **Chrome Extension**: Browser-based proxy management and configuration
- **Cloud Integration**: Automated node deployment via Vultr cloud infrastructure
- **Multi-Device Support**: Synchronize proxy settings across devices with secure API key authentication

## Architecture

This is a **monorepo** containing:

- **Web App** (`apps/web/`): React-based dashboard for node management
- **Chrome Extension** (`apps/chrome-extension/`): Browser extension for proxy control
- **Shared UI** (`packages/`): Common components and utilities

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Netlify Functions, PostgreSQL, Prisma ORM
- **Authentication**: Solana Web3.js, Wallet Adapter
- **Infrastructure**: Vultr API, Chrome Extension APIs
- **Development**: Turbo (monorepo), Vite, npm

## Database Schema

Core entities managed by the platform:

- **Users**: Solana wallet-based authentication
- **Nodes**: Proxy server configurations (IP, port, protocol, region)
- **DeviceAuth**: API keys for Chrome extension authentication
- **UserSavedNodes**: User's saved proxy configurations
- **LinkCodes**: Temporary codes for device linking

## Development

### Prerequisites

- Node.js 18+
- npm package manager
- PostgreSQL database
- Solana wallet (for testing)

### Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Start web app
npm run dev:web

# Start Chrome extension
npm run dev:chrome-extension
```

### Scripts

- `npm run dev:web` - Run web app in development mode
- `npm run build:web` - Build web app for production
- `npm run dev:chrome-extension` - Run Chrome extension in development
- `npm run build:chrome-extension` - Build Chrome extension

### API Development

**Important**: When updating the Prisma schema, update `netlify/functions/types.ts` to align API types with database changes.

API endpoints follow CRUD conventions: `createUser`, `updateUser`, `deleteUser`, `getUser`, `getUsers`, etc.

## License

MIT
