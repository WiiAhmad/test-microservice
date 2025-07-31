# bhvr 🦫

![cover](https://cdn.stevedylan.dev/ipfs/bafybeievx27ar5qfqyqyud7kemnb5n2p4rzt2matogi6qttwkpxonqhra4)

A full-stack TypeScript monorepo with microservices architecture, using Bun, Hono, Vite, React, and Prisma.

## Why bhvr?

While there are plenty of existing app building stacks out there, many of them are either bloated, outdated, or have too much of a vendor lock-in. bhvr is built with the opinion that you should be able to deploy your client or server in any environment while also keeping type safety.

This project has been extended from the original bhvr template to include a microservices architecture with multiple backend services and database integration using Prisma.

## Architecture Overview

This project includes a microservices architecture with multiple backend services:

- **API Gateway** (`server`) - Port 3000 - SQLite database: `server.db` - Routes requests to appropriate services
- **User Service** (`server1`) - Port 3001 - SQLite database: `users.db` - Manages user data and authentication  
- **Client** (`client`) - React frontend application
- **Shared** (`shared`) - Common types and utilities

## Features

- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Microservices Architecture**: Service isolation with independent development and deployment
- **Shared Types**: Common type definitions shared between all services and client
- **Database Integration**: Prisma ORM with SQLite databases for each service
- **Monorepo Structure**: Organized as a workspaces-based monorepo with Turbo for build orchestration
- **Modern Stack**:
  - [Bun](https://bun.sh) as the JavaScript runtime and package manager
  - [Hono](https://hono.dev) as the backend framework
  - [Prisma](https://www.prisma.io/orm) as the database ORM
  - [Vite](https://vitejs.dev) for frontend bundling
  - [React](https://react.dev) for the frontend UI
  - [Turbo](https://turbo.build) for monorepo build orchestration and caching

## Project Structure

```
micro/
├── client/               # React frontend (Vite + React)
├── server/               # API Gateway (Port 3000) - SQLite database
├── server1/              # User Service (Port 3001) - SQLite database
├── shared/               # Shared TypeScript definitions
│   └── src/types/        # Type definitions used by all services and client
├── package.json          # Root package.json with workspaces
├── turbo.json            # Turbo configuration for build orchestration
└── Database files:
    ├── server/prisma/server.db    # API Gateway database
    └── server1/prisma/users.db    # User Service database
```

## Services

### API Gateway (Port 3000)
The main entry point that routes requests to appropriate microservices and manages API logs.

**Endpoints:**
- `GET /` - Gateway status
- `GET /health` - Health check with database status
- `GET /hello` - Simple API test
- `GET /api/logs` - API request logs
- `GET /api/services` - Service registry
- `GET /users/*` - Proxy to User Service

**Database Schema:**
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

### User Service (Port 3001)
Manages user-related operations with database persistence.

**Endpoints:**
- `GET /` - Service status
- `GET /health` - Health check with database status
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/profile` - Create user profile

**Database Schema:**
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

### Server

bhvr uses Hono as a backend API for its simplicity and massive ecosystem of plugins. If you have ever used Express then it might feel familiar. Declaring routes and returning data is easy.

```
server
├── bun.lock
├── package.json
├── README.md
├── src
│   └── index.ts
└── tsconfig.json
```

```typescript src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true
  }

  return c.json(data, { status: 200 })
})

export default app
```

If you wanted to add a database to Hono you can do so with a multitude of Typescript libraries like [Supabase](https://supabase.com), or ORMs like [Drizzle](https://orm.drizzle.team/docs/get-started) or [Prisma](https://www.prisma.io/orm)

### Client

bhvr uses Vite + React Typescript template, which means you can build your frontend just as you would with any other React app. This makes it flexible to add UI components like [shadcn/ui](https://ui.shadcn.com) or routing using [React Router](https://reactrouter.com/start/declarative/installation).

```
client
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.tsx
│   ├── assets
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

```typescript src/App.tsx
import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { ApiResponse } from 'shared'
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/stevedylandev/bhvr" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <button onClick={sendRequest}>
          Call API
        </button>
        {data && (
          <pre className='response'>
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
      <p className="read-the-docs">
        Click the beaver to learn more
      </p>
    </>
  )
}

export default App
```

```
client
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

```typescript src/App.tsx
import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { ApiResponse } from 'shared'
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/stevedylandev/bhvr" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <button onClick={sendRequest}>
          Call API
        </button>
        {data && (
          <pre className='response'>
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
      <p className="read-the-docs">
        Click the beaver to learn more
      </p>
    </>
  )
}

export default App
```

### Shared

The Shared package is used for anything you want to share between the Server and Client. This could be types or libraries that you use in both environments.

```
shared
├── package.json
├── src
│   ├── index.ts
│   └── types
│       └── index.ts
└── tsconfig.json
```

Inside the `src/index.ts` we export any of our code from the folders so it's usable in other parts of the monorepo

```typescript
export * from "./types"
```

By running `bun run dev` or `bun run build` it will compile and export the packages from `shared` so it can be used in either `client` or `server`

```typescript
import { ApiResponse } from 'shared'
```

## Getting Started

### Quick Start

You can start a new bhvr project using the [CLI](https://github.com/stevedylandev/create-bhvr)

```bash
bun create bhvr
```

### Installation

```bash
# Install dependencies for all workspaces
bun install
```

This will automatically run the database setup and build shared packages via the `postinstall` script.

### Database Setup

The project uses Prisma with SQLite databases for each service. Database operations are handled directly (not through Turbo) for simplicity and reliability.

```bash
# Setup all databases (generate + push)
bun run db:setup

# Generate Prisma clients for all services
bun run db:generate:all

# Push database schemas for all services  
bun run db:push:all

# Seed all databases
bun run db:seed:all

# Individual service operations
cd server && bun run db:generate    # API Gateway
cd server1 && bun run db:generate   # User Service
```

### First Time Setup
```bash
# 1. Install dependencies
bun install

# 2. Setup databases (if not done automatically)
bun run db:setup

# 3. Start development servers
bun run dev:all-servers
```

### Development

```bash
# Run all services and client with Turbo
bun run dev

# Run all backend services only
bun run dev:all-servers

# Run individual services
bun run dev:client    # Run the Vite dev server for React
bun run dev:server    # Run the API Gateway (Port 3000)
bun run dev:server1   # Run the User Service (Port 3001)
```

### Daily Development Workflow
```bash
# Just start the servers (databases already set up)
bun run dev:all-servers
```

### Making Schema Changes
```bash
# 1. Edit prisma/schema.prisma in the relevant service
# 2. Push changes
cd server && bun run db:push    # For API Gateway
# OR
cd server1 && bun run db:push   # For User Service

# 3. Restart dev servers if needed
```

### Building

```bash
# Build all workspaces with Turbo
bun run build

# Or build individual workspaces directly
bun run build:client  # Build the React frontend
bun run build:server  # Build the API Gateway
bun run build:server1 # Build the User Service
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

# Create a new user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"user"}'

# Create a user profile
curl -X POST http://localhost:3001/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{"bio":"Software developer","phone":"123-456-7890"}'
```

### Verification

Test that everything is working:

```bash
# 1. Check databases exist
ls server/prisma/server.db
ls server1/prisma/users.db

# 2. Test API Gateway
curl http://localhost:3000/health

# 3. Test User Service  
curl http://localhost:3001/health

# 4. Test User API
curl http://localhost:3001/api/users
```

### Additional Commands

```bash
# Lint all workspaces
bun run lint

# Type check all workspaces
bun run type-check

# Run tests across all workspaces
bun run test
```

## Available Scripts

Root level commands (via Turbo):
- `bun run dev` - Run all services and client
- `bun run dev:all-servers` - Run all backend services
- `bun run dev:server` - Run API Gateway only (Port 3000)
- `bun run dev:server1` - Run User Service only (Port 3001)
- `bun run dev:client` - Run React client only
- `bun run build` - Build all projects
- `bun run build:server` - Build API Gateway only
- `bun run build:server1` - Build User Service only
- `bun run build:client` - Build React client only
- `bun run lint` - Lint all projects
- `bun run type-check` - Type check all projects

Database commands (Direct Prisma):
- `bun run db:setup` - Complete database setup (generate + push + seed)
- `bun run db:generate:all` - Generate Prisma clients for all services
- `bun run db:push:all` - Push database schemas for all services
- `bun run db:seed:all` - Seed databases for all services

## Turbo + Prisma Integration

This project has been configured with Turbo to handle development and build orchestration while keeping database operations simple and direct.

### Database Configuration Approach
- **Direct Prisma Commands**: Prisma operations run directly, not through Turbo
- **Turbo for Dev/Build Only**: Turbo handles `dev` and `build` commands only
- **Separate Databases**: Each service has its own SQLite database file

### Turbo Task Dependencies

The `turbo.json` file has been configured with proper task dependencies:

1. **dev** - Depends on `db:generate` and `db:push` (when available)
2. **build** - Depends on `db:generate` (when available)
3. **Parallel Execution** - All compatible operations run in parallel across services
4. **Caching** - Turbo caches results when possible (disabled for database operations)

### Benefits of This Setup

1. **Simple Database Management**: Direct Prisma commands, no complex Turbo dependencies
2. **Service Isolation**: Each service has its own database and can be developed independently  
3. **Turbo Efficiency**: Turbo handles what it does best - dev and build orchestration
4. **TypeScript Safety**: All type errors resolved, proper imports configured
5. **Development Speed**: Fast startup with `bun run dev:all-servers`
6. **Fault Tolerance**: If one service fails, others continue to operate
7. **Team Scalability**: Different teams can work on different services

### Deployment

Deplying each piece is very versatile and can be done numerous ways, and exploration into automating these will happen at a later date. Here are some references in the meantime.

**Client**
- [Orbiter](https://orbiter.host)
- [GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Netlify](https://vite.dev/guide/static-deploy.html#netlify)
- [Cloudflare Pages](https://vite.dev/guide/static-deploy.html#cloudflare-pages)

**Server**
- [Cloudflare Worker](https://gist.github.com/stevedylandev/4aa1fc569bcba46b7169193c0498d0b3)
- [Bun](https://hono.dev/docs/getting-started/bun)
- [Node.js](https://hono.dev/docs/getting-started/nodejs)

## Type Sharing

Types are automatically shared between the client and all services thanks to the shared package and TypeScript path aliases. You can import them in your code using:

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

## Microservices Benefits

This architecture provides:

1. **Service Isolation**: Each service can be developed, deployed, and scaled independently
2. **Technology Flexibility**: Different services can use different technologies if needed
3. **Fault Tolerance**: If one service fails, others continue to operate
4. **Team Scalability**: Different teams can work on different services
5. **Performance**: Services can be optimized for their specific use cases
6. **Database Separation**: Each service maintains its own database for data isolation

## Learn More

- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Hono Documentation](https://hono.dev/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turbo Documentation](https://turbo.build/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Microservices Architecture](https://microservices.io/)

## Technologies

- **Runtime**: Bun
- **Web Framework**: Hono
- **Database ORM**: Prisma
- **Database**: SQLite
- **Frontend**: React + Vite
- **Build System**: Turbo
- **Language**: TypeScript
- **Architecture**: Microservices

---

The setup is now clean, working, and follows best practices! 🚀
