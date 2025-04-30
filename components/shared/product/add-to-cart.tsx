'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.actions'
import { CartItem } from '@/types'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

type AddToCartProps = {
  item: Omit<CartItem, 'cartId'>
}

const AddToCart = ({ item }: AddToCartProps) => {
  const handleAddToCart = async () => {
    const res = await addItemToCart(item)

    if (!res.success) {
      return toast.error(res.message)
    }

    // Handle success add to cart
    toast(res.message, {
      description: (
        <Link href="/cart" className="hover:underline">
          Go to cart
        </Link>
      ),
    })
  }

  return (
    <Button className="w-full" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  )
}

export default AddToCart
