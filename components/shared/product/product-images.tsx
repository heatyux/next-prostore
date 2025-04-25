'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

type ProductImagesProps = {
  images: string[]
}

const ProductImages = ({ images }: ProductImagesProps) => {
  const [current, setCurrent] = useState(0)

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
        alt="hero image"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              'mr-2 cursor-pointer border hover:border-orange-600',
              current === index && 'border-orange-500',
            )}
            onClick={() => setCurrent(index)}
          >
            <Image src={image} width={100} height={100} alt="image" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
