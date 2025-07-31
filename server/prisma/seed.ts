import { PrismaClient } from '../node_modules/.prisma/client-server'

const prisma = new PrismaClient()

async function main() {
    // Create or update sample services
    await prisma.service.upsert({
        where: { name: 'user-service' },
        update: {
            url: 'http://localhost:3001',
            status: 'healthy',
            lastChecked: new Date()
        },
        create: {
            name: 'user-service',
            url: 'http://localhost:3001',
            status: 'healthy'
        }
    })

    await prisma.service.upsert({
        where: { name: 'api-gateway' },
        update: {
            url: 'http://localhost:3000',
            status: 'healthy',
            lastChecked: new Date()
        },
        create: {
            name: 'api-gateway',
            url: 'http://localhost:3000',
            status: 'healthy'
        }
    })

    console.log('✅ API Gateway database seeded')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
