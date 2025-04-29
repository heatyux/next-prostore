'use server'

import { auth } from '@/auth'
import { CartItem } from '@/types'
import { cookies } from 'next/headers'
import { convertToPlainObject, formatError } from '../utils'
import { prisma } from '@/db/prisma'
import { cartItemSchema } from '../validator'

export async function addItemToCart(data: CartItem) {
  try {
    // Check fro cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) {
      throw new Error('Cart session not found')
    }

    // Get session and user ID
    const session = await auth()
    const userId = session?.user?.id

    // Get cart from database
    const cart = await getMyCart()

    // Parse and validate item
    const item = cartItemSchema.parse(data)

    // Find product in database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // Testing
    console.log(
      'Session cart id: ',
      sessionCartId,
      'User id: ',
      userId,
      'items requested: ',
      item,
      'product found: ',
      product,
      'cart: ',
      cart,
    )

    return {
      success: true,
      message: 'Item added to the cart',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if (!sessionCartId) {
    throw new Error('Cart session not found')
  }

  // Get session and user ID
  const session = await auth()
  const userId = session?.user?.id

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { id: userId } : { sessionCartId: sessionCartId },
  })

  if (!cart) {
    return
  }

  // Convert decimal values to string
  return convertToPlainObject({
    ...cart,
    items: cart.items,
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}
