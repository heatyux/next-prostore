'use client'

import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCarouselProps {
  data: Product[]
}

export const ProductCarousel = ({ data }: ProductCarouselProps) => {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
      className="mb-12 w-full"
    >
      <CarouselContent>
        {data.map((product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority
                  className="h-auto w-full"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900/50 px-2 text-2xl font-bold text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
