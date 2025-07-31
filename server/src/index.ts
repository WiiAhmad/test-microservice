import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { timing } from 'hono/timing'
import type { ApiResponse } from 'shared/dist'
import { prisma } from './lib/prisma'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(cors())
app.use(logger())
app.use(timing())

// Logging middleware
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start

  // Log API request
  try {
    await prisma.apiLog.create({
      data: {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        duration,
        userAgent: c.req.header('user-agent'),
        ip: c.req.header('x-forwarded-for') || 'unknown'
      }
    })
  } catch (error) {
    console.error('Failed to log request:', error)
  }
})

app.get('/', (c) => {
  return c.text('API Gateway Service - Port 3000')
})

app.get('/hello', async (c) => {
  const data: ApiResponse = {
    message: "Hello from API Gateway!",
    success: true
  }

  return c.json(data, { status: 200 })
})

app.get('/health', async (c) => {
  // Check database connection
  let dbStatus = 'healthy'
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    dbStatus = 'unhealthy'
  }

  return c.json({
    service: 'api-gateway',
    status: 'healthy',
    database: dbStatus,
    port: 3000,
    timestamp: new Date().toISOString()
  })
})

// Get API logs
app.get('/api/logs', async (c) => {
  try {
    const logs = await prisma.apiLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' }
    })

    const response: ApiResponse = {
      message: 'API logs retrieved successfully',
      success: true,
      data: logs
    }
    return c.json(response)
  } catch (error) {
    const response: ApiResponse = {
      message: 'Failed to retrieve logs',
      success: false
    }
    return c.json(response, 500)
  }
})

// Service management
app.get('/api/services', async (c) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    })

    const response: ApiResponse = {
      message: 'Services retrieved successfully',
      success: true,
      data: services
    }
    return c.json(response)
  } catch (error) {
    const response: ApiResponse = {
      message: 'Failed to retrieve services',
      success: false
    }
    return c.json(response, 500)
  }
})

// Proxy routes to User Service
app.get('/users/*', async (c) => {
  const path = c.req.path.replace('/users', '')
  try {
    const response = await fetch(`http://localhost:3001${path}`)
    const data = await response.json()
    return c.json(data as any)
  } catch (error) {
    return c.json({ error: 'User service unavailable' }, 503)
  }
})

const port = process.env.PORT || 3000
console.log(`🚀 API Gateway running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
