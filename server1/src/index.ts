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

app.get('/', (c) => {
    const response: ApiResponse = {
        message: 'User Service - Port 3001',
        success: true
    }
    return c.json(response)
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
        service: 'user-service',
        status: 'healthy',
        database: dbStatus,
        port: 3001,
        timestamp: new Date().toISOString()
    })
})

app.get('/api/users', async (c) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                profile: true
            },
            orderBy: { createdAt: 'desc' }
        })

        const response: ApiResponse = {
            message: 'Users retrieved successfully',
            success: true,
            data: users
        }
        return c.json(response)
    } catch (error) {
        const response: ApiResponse = {
            message: 'Failed to retrieve users',
            success: false
        }
        return c.json(response, 500)
    }
})

app.get('/api/users/:id', async (c) => {
    const id = c.req.param('id')

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true
            }
        })

        if (!user) {
            const response: ApiResponse = {
                message: 'User not found',
                success: false
            }
            return c.json(response, 404)
        }

        const response: ApiResponse = {
            message: 'User retrieved successfully',
            success: true,
            data: user
        }
        return c.json(response)
    } catch (error) {
        const response: ApiResponse = {
            message: 'Failed to retrieve user',
            success: false
        }
        return c.json(response, 500)
    }
})

app.post('/api/users', async (c) => {
    try {
        const body = await c.req.json()

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                role: body.role || 'user'
            },
            include: {
                profile: true
            }
        })

        const response: ApiResponse = {
            message: 'User created successfully',
            success: true,
            data: user
        }
        return c.json(response, 201)
    } catch (error: any) {
        let message = 'Failed to create user'
        if (error.code === 'P2002') {
            message = 'Email already exists'
        }

        const response: ApiResponse = {
            message,
            success: false
        }
        return c.json(response, 400)
    }
})

app.put('/api/users/:id', async (c) => {
    const id = c.req.param('id')

    try {
        const body = await c.req.json()

        const user = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                isActive: body.isActive
            },
            include: {
                profile: true
            }
        })

        const response: ApiResponse = {
            message: 'User updated successfully',
            success: true,
            data: user
        }
        return c.json(response)
    } catch (error: any) {
        let message = 'Failed to update user'
        let status = 500

        if (error.code === 'P2025') {
            message = 'User not found'
            status = 404
        } else if (error.code === 'P2002') {
            message = 'Email already exists'
            status = 400
        }

        const response: ApiResponse = {
            message,
            success: false
        }
        return c.json(response, status as any)
    }
})

app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id')

    try {
        await prisma.user.delete({
            where: { id }
        })

        const response: ApiResponse = {
            message: 'User deleted successfully',
            success: true
        }
        return c.json(response)
    } catch (error: any) {
        let message = 'Failed to delete user'
        let status = 500

        if (error.code === 'P2025') {
            message = 'User not found'
            status = 404
        }

        const response: ApiResponse = {
            message,
            success: false
        }
        return c.json(response, status as any)
    }
})

// Profile endpoints
app.post('/api/users/:id/profile', async (c) => {
    const userId = c.req.param('id')

    try {
        const body = await c.req.json()

        const profile = await prisma.profile.create({
            data: {
                userId,
                bio: body.bio,
                avatar: body.avatar,
                phone: body.phone,
                address: body.address
            }
        })

        const response: ApiResponse = {
            message: 'Profile created successfully',
            success: true,
            data: profile
        }
        return c.json(response, 201)
    } catch (error: any) {
        let message = 'Failed to create profile'
        if (error.code === 'P2002') {
            message = 'Profile already exists for this user'
        }

        const response: ApiResponse = {
            message,
            success: false
        }
        return c.json(response, 400)
    }
})

const port = process.env.PORT || 3001
console.log(`👤 User Service running on port ${port}`)

export default {
    port,
    fetch: app.fetch,
}
