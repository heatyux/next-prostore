'use server'

import { auth } from '@/auth'
import { CartItem } from '@/types'
import { cookies } from 'next/headers'
import { convertToPlainObject, formatError, round2 } from '../utils'
import { prisma } from '@/db/prisma'
import { cartItemSchema, insertCartSchema } from '../validator'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

// Calculate cart price
const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  )
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

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

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      })

      // Add to database
      await prisma.cart.create({
        data: newCart,
      })

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} added to cart`,
      }
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (cartItem) => cartItem.productId === item.productId,
      )

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock')
        }

        // Increase the quantity
        ;(cart.items as CartItem[]).find(
          (cartItem) => cartItem.productId === item.productId,
        )!.qty = existItem.qty + 1
      } else {
        // If item does not exist in cart
        // Check stock
        if (product.stock < 1) {
          throw new Error('Not enough stock')
        }

        // Add item to the cart.items
        cart.items.push(item)
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      })

      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart successfully`,
      }
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
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  })

  if (!cart) {
    return
  }

  // Convert decimal values to string
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}

// Remove item from cart in database
export async function removeItemFromCart(productId: string) {
  try {
    // Get for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) {
      throw new Error('Cart session not found')
    }

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    })
    if (!product) {
      throw new Error('Product not found')
    }

    // Get user cart
    const cart = await getMyCart()
    if (!cart) {
      throw new Error('Cart not found')
    }

    // Check for item
    const existItem = (cart.items as CartItem[]).find(
      (item) => item.productId === productId,
    )
    if (!existItem) {
      throw new Error('Item not found')
    }

    // Check if cart has only one item
    if (existItem.qty === 1) {
      // Remove item from cart
      cart.items = (cart.items as CartItem[]).filter(
        (item) => item.productId !== productId,
      )
    } else {
      // Decrease quantity of existing item
      ;(cart.items as CartItem[]).find(
        (item) => item.productId === productId,
      )!.qty = existItem.qty - 1
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    })

    // Revalidate product page
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
