# Turbo + Prisma Integration Guide

This project has been configured with Turbo to automatically handle Prisma operations across all microservices.

## Architecture

- **API Gateway** (`server`) - Port 3000 - Uses SQLite database for API logs and service monitoring
- **User Service** (`server1`) - Port 3001 - Uses SQLite database for user management

## Available Commands

### Root Level Commands (via Turbo)

```bash
# Generate Prisma clients for all services
bun run db:generate

# Push database schemas for all services  
bun run db:push

# Run database migrations for all services
bun run db:migrate

# Seed databases for all services
bun run db:seed

# Open Prisma Studio for all services (runs in parallel)
bun run db:studio

# Complete database setup (generate + push + seed)
bun run db:setup

# Development with automatic Prisma setup
bun run dev:all-servers
```

### Individual Service Commands

```bash
# API Gateway only
bun run dev:server
bun run build:server

# User Service only  
bun run dev:server1
bun run build:server1
```

## Turbo Configuration

The `turbo.json` file has been configured with proper Prisma task dependencies:

### Dependency Chain

1. **db:generate** - Generates Prisma clients (no dependencies)
2. **db:push** - Depends on `db:generate` 
3. **db:seed** - Depends on `db:push`
4. **dev** - Depends on `db:generate` and `db:push`
5. **build** - Depends on `db:generate`

### Task Configuration

```json
{
  "db:generate": {
    "cache": false,
    "inputs": ["prisma/schema.prisma"],
    "outputs": ["node_modules/.prisma/**", "node_modules/@prisma/client/**"]
  },
  "db:push": {
    "dependsOn": ["db:generate"],
    "cache": false,
    "inputs": ["prisma/schema.prisma"],
    "outputs": ["prisma/*.db", "prisma/dev.db*"]
  },
  "dev": {
    "dependsOn": ["db:generate", "db:push"],
    "cache": false,
    "persistent": true
  }
}
```

## Database Schemas

### API Gateway (server)
```prisma
model ApiLog {
  id        String   @id @default(cuid())
  method    String
  path      String
  status    Int
  duration  Int
  userAgent String?
  ip        String?
  createdAt DateTime @default(now())
}

model Service {
  id          String   @id @default(cuid())
  name        String   @unique
  url         String
  status      String
  lastChecked DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### User Service (server1)
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      String   @default("user")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profile   Profile?
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  bio       String?
  avatar    String?
  phone     String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Development Workflow

### Starting Development

```bash
# This will automatically:
# 1. Generate Prisma clients for all services
# 2. Push database schemas 
# 3. Start all servers
bun run dev:all-servers
```

### Making Schema Changes

1. Edit `prisma/schema.prisma` in the relevant service
2. Push changes: `bun run db:push`
3. Restart development servers

### Adding New Services

1. Create new service directory
2. Add to `workspaces` in root `package.json`
3. Add Prisma configuration if needed
4. Turbo will automatically include it in parallel operations

## Database Files

Each service maintains its own SQLite database:
- `server/prisma/dev.db` - API Gateway database
- `server1/prisma/dev.db` - User Service database

## Testing the Setup

```bash
# Test Prisma generation
bun run db:generate

# Test database push
bun run db:push  

# Test complete setup
bun run db:setup

# Test development startup
bun run dev:all-servers
```

## Benefits

1. **Automatic Dependency Management** - Turbo ensures Prisma clients are generated before building/starting
2. **Parallel Execution** - All Prisma operations run in parallel across services
3. **Caching** - Turbo caches results when possible (disabled for database operations)
4. **Consistent Workflow** - Same commands work across all services
5. **Development Efficiency** - One command sets up and starts everything
