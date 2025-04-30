'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { Cart, CartItem } from '@/types'
import { Loader, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'

type AddToCartProps = {
  item: Omit<CartItem, 'cartId'>
  cart?: Cart
}

const AddToCart = ({ item, cart }: AddToCartProps) => {
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item)

      if (!res.success) {
        toast.error(res.message)
        return
      }

      // Handle success add to cart
      toast(res.message, {
        description: (
          <Link href="/cart" className="hover:underline">
            Go to cart
          </Link>
        ),
      })
    })
  }

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId)

      if (res.success) {
        toast(res.message)
      } else {
        toast.error(res.message)
      }

      return
    })
  }

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((c) => c.productId === item.productId)

  return existItem ? (
    <div>
      <Button
        variant="outline"
        disabled={isPending}
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" disabled={isPending} onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{' '}
      Add To Cart
    </Button>
  )
}

export default AddToCart
