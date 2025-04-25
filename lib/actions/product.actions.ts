'use server'

import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '../utils'
import { LATEST_PRODUCT_LIMIT } from '../contants'

// Get the latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return convertToPlainObject(data)
}
