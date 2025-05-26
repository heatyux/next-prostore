'use server'

import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '../utils'
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from '../constants'

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

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug },
  })
}

// Get all products
export async function getAllProducts({
  query,
  category,
  limit = PAGE_SIZE,
  page,
}: {
  query: string
  category: string
  limit?: number
  page: number
}) {
  const data = await prisma.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
  })

  const dataCount = await prisma.product.count()

  return {
    data,
    totalPage: Math.ceil(dataCount / limit),
  }
}
