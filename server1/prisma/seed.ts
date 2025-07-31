import { PrismaClient } from '../node_modules/.prisma/client-user'

const prisma = new PrismaClient()

async function main() {
    // Create or update sample users
    await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {
            name: 'John Doe',
            role: 'admin',
            isActive: true
        },
        create: {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin'
        }
    })

    await prisma.user.upsert({
        where: { email: 'jane@example.com' },
        update: {
            name: 'Jane Smith',
            role: 'user',
            isActive: true
        },
        create: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user'
        }
    })

    await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {
            name: 'Bob Johnson',
            role: 'user',
            isActive: true
        },
        create: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'user'
        }
    })

    console.log('✅ User Service database seeded')
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
