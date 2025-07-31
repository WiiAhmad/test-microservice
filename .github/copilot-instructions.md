# bhvr Microservices Copilot Instructions

## Architecture Overview

This is a **microservices monorepo** built with Bun, Hono, Prisma, React, and Turbo. The architecture consists of:

- **API Gateway** (`server/`) - Port 3000, SQLite database `server.db`
- **User Service** (`server1/`) - Port 3001, SQLite database `users.db`  
- **React Client** (`client/`) - Vite + React with shadcn/ui components
- **Shared Types** (`shared/`) - Common TypeScript types across all services

### Client
The React Client is built with Vite and uses shadcn/ui all components already installed in folder `src/components/ui/`.
if needed, additional components can be created in this folder components.

if needed can use context7 for codebase react, react-router v7 datamode and shadcn/ui

## Key Development Patterns

### Service Structure
Each service follows this pattern:
- Hono app with CORS and timing middleware
- Database operations via Prisma ORM with custom client output paths
- Shared `ApiResponse<T>` type for consistent API responses
- Health check endpoints with database connectivity status

### Database Architecture
- **Per-service databases**: Each service has its own SQLite database file
- **Custom Prisma outputs**: Services generate clients to separate paths (`client-server`, `client-user`)
- **Database operations are NOT managed by Turbo** - use direct commands for reliability

### Type Safety
Import shared types with: `import { ApiResponse } from 'shared/dist'`
The `ApiResponse<T>` type provides consistent response structure:
```typescript
{ message: string; success: boolean; data?: T }
```

## Development Workflow

### Starting Development
```bash
# Full setup (first time)
bun install && bun run db:setup && bun run dev:all-servers

# Daily development (databases already set up)
bun run dev:all-servers
```

### Database Operations (Direct Commands)
```bash
# Setup all databases
bun run db:setup

# Individual service operations
cd server && bun run db:generate && bun run db:push
cd server1 && bun run db:generate && bun run db:push
```

### Service Communication
- **API Gateway proxies requests**: `/users/*` → User Service
- **Direct service calls**: Client can call services directly for development
- **Health checks**: All services expose `/health` endpoints with database status

## Project-Specific Conventions

### Error Handling
Services handle Prisma errors with specific error codes:
- `P2002` - Unique constraint violation
- `P2025` - Record not found
Use appropriate HTTP status codes (400, 404, 500) with consistent `ApiResponse` format.

### Middleware Stack
All services use:
1. CORS middleware for cross-origin requests
2. Timing middleware for performance monitoring  
3. Custom logging middleware (API Gateway only) - logs to database

### Build System
- **Turbo handles**: `dev`, `build`, `lint`, `type-check` commands
- **Direct scripts handle**: Database operations (`db:generate`, `db:push`, `db:seed`)
- **Workspaces**: Each service and client is a separate workspace

## File Patterns

### Service Entry Points
- `server/src/index.ts` - API Gateway with proxy routing and logging
- `server1/src/index.ts` - User Service with full CRUD operations
- Services export `{ port, fetch: app.fetch }` for Bun runtime

### Database Files
- `*/prisma/schema.prisma` - Service-specific schemas
- `*/src/lib/prisma.ts` - Prisma client initialization with custom import paths
- `*/prisma/*.db` - SQLite database files (gitignored)

### Client Integration
- `client/src/pages/home/HomePage.tsx` - Demonstrates service communication patterns
- Client uses React Router with loader data for service URLs
- UI components from shadcn/ui in `client/src/components/ui/`

## Critical Commands

```bash
# Service management
bun run dev:server    # API Gateway only
bun run dev:server1   # User Service only  
bun run dev:all-servers  # All backend services

# Database operations (always direct, never through Turbo)
bun run db:generate:all  # Generate all Prisma clients
bun run db:push:all     # Push all schemas to databases
bun run db:seed:all     # Seed all databases

# Build operations (via Turbo)
bun run build           # Build all workspaces
bun run build:server    # Build specific service
```

## Testing Service Integration

Each service exposes health endpoints and the client provides a testing interface:
- Gateway: `http://localhost:3000/health`
- User Service: `http://localhost:3001/health`
- Test user operations through `/api/users` endpoints
- API Gateway logs all requests to database for monitoring

## When Adding New Services

1. Create new workspace directory with Prisma setup
2. Add to root `package.json` workspaces array
3. Follow existing service patterns (Hono app, health endpoints, Prisma integration)
4. Add proxy routes to API Gateway if needed
5. Database operations stay as direct commands, not Turbo tasks
