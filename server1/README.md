# User Service (Server1)

A microservice for managing users.

## Port
- **Development**: 3001

## Endpoints

### Health Check
- `GET /health` - Service health status

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

## Example Usage

```bash
# Get all users
curl http://localhost:3001/api/users

# Get specific user
curl http://localhost:3001/api/users/1

# Create new user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"user"}'
```

## Development

```bash
# Run in development mode
bun run dev

# Build
bun run build
```
