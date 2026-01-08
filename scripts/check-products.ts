import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  const count = await prisma.product.count({ where: { isActive: true } })
  console.log('Active products:', count)
  const latest = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, createdAt: true }
  })
  console.log('Latest:', latest)
  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
