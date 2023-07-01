import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log:['query']})

async function main() {    
    // Clear
    await prisma.user.deleteMany()
    await prisma.userPreference.deleteMany()
    // Create
    const user = await prisma.user.create({
        data: {
            name: "Kyle",
            email: "kyle@test.com",
            age: 27,
            userPreference: {
                create: {
                    emailUpdates: true
                }
            }
        },
/*         include: {
            userPreference: true
        } */
        select: {
            name: true,
            userPreference: { select: { id: true } },
        }
    })
    console.log(user)


    // Create many
    const users = await prisma.user.createMany({
        data: [
            {
                name: "Sally",
                email: "sally@test.com",
                age: 32,
            },
            {
                name: "John",
                email: "john@test.com",
                age: 29
            },
        ]
    })
    console.log(users)
    
    // Search
    const searchResult = await prisma.user.findMany({
        where: {
            email: { startsWith: "kyle" }
        }
    })
    console.log(searchResult)

    // Update
    const user2 = await prisma.user.update({
        where: {
            email: "sally@test.com"
        },
        data: {
            name: "Sally2"
        }
    })

    console.log(user2)

    const user3 = await prisma.user.update({
        where: {
            email: "john@test.com"
        },
        data: {
            userPreference: {
                create: {
                    emailUpdates: true
                }
            }
        },
        include: {
            userPreference: true
        }
    })

    console.log(user3)
}

main()
    .catch(e => {
        console.log(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })