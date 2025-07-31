# Microservices Architecture with bhvr 🦫

![cover](https://cdn.stevedylan.dev/ipfs/bafybeievx27ar5qfqyqyud7kemnb5n2p4rzt2matogi6qttwkpxonqhra4)

A full-stack TypeScript monorepo with microservices architecture, using Bun, Hono, Vite, and React.

## Architecture Overview

This project has been extended from the original bhvr template to include a microservices architecture with multiple backend services:

- **API Gateway** (`server`) - Port 3000 - Routes requests to appropriate services
- **User Service** (`server1`) - Port 3001 - Manages user data and authentication  
- **Client** (`client`) - React frontend application
- **Shared** (`shared`) - Common types and utilities

## Services

### API Gateway (Port 3000)
The main entry point that routes requests to appropriate microservices.

**Endpoints:**
- `GET /` - Gateway status
- `GET /health` - Health check
- `GET /users/*` - Proxy to User Service
- `GET /products/*` - Proxy to Product Service

### User Service (Port 3001)
Manages user-related operations with mock data.

**Endpoints:**
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

## Quick Start

### Installation
```bash
bun install
```

### Development

Run all services:
```bash
bun run dev:all-servers
```

Run individual services:
```bash
# API Gateway
bun run dev:server

# User Service  
bun run dev:server1

# Product Service
bun run dev:server2

# Client
bun run dev:client
```

### Testing the Services

Once all services are running, you can test them:

```bash
# Test API Gateway
curl http://localhost:3000/health

# Test User Service directly
curl http://localhost:3001/api/users

# Test User Service through API Gateway
curl http://localhost:3000/users/api/users

# Test Product Service directly
curl http://localhost:3002/api/products

# Test Product Service through API Gateway
curl http://localhost:3000/products/api/products

# Create a new user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"user"}'

# Create a new product
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"New Gadget","price":299.99,"category":"Electronics","stock":10}'
```

## Project Structure

```
micro/
├── client/          # React frontend (Vite + React)
├── server/          # API Gateway (Port 3000)
├── server1/         # User Service (Port 3001) 
├── server2/         # Product Service (Port 3002)
├── shared/          # Shared types and utilities
├── package.json     # Root package with workspace scripts
└── turbo.json       # Turbo build configuration
```

## Build

Build all services:
```bash
bun run build
```

Build individual services:
```bash
bun run build:server   # API Gateway
bun run build:server1  # User Service
bun run build:server2  # Product Service
bun run build:client   # React client
```

## Available Scripts

- `bun run dev` - Run all services and client
- `bun run dev:all-servers` - Run all backend services
- `bun run dev:server` - Run API Gateway only
- `bun run dev:server1` - Run User Service only
- `bun run dev:server2` - Run Product Service only
- `bun run dev:client` - Run React client only
- `bun run build` - Build all projects
- `bun run lint` - Lint all projects
- `bun run type-check` - Type check all projects

## Technologies

- **Runtime**: Bun
- **Web Framework**: Hono
- **Frontend**: React + Vite
- **Build System**: Turbo
- **Language**: TypeScript
- **Architecture**: Microservices

## Microservices Benefits

This architecture provides:

1. **Service Isolation**: Each service can be developed, deployed, and scaled independently
2. **Technology Flexibility**: Different services can use different technologies if needed
3. **Fault Tolerance**: If one service fails, others continue to operate
4. **Team Scalability**: Different teams can work on different services
5. **Performance**: Services can be optimized for their specific use cases

## Type Sharing

Types are automatically shared between all services and the client thanks to the shared package:

```typescript
import { ApiResponse } from 'shared/types';
```

The `ApiResponse` type has been enhanced to support optional data and boolean success states:

```typescript
export type ApiResponse<T = any> = {
  message: string;
  success: boolean;
  data?: T;
}
```

## Learn More

- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Hono Documentation](https://hono.dev/docs)
- [Turbo Documentation](https://turbo.build/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Microservices Architecture](https://microservices.io/)
