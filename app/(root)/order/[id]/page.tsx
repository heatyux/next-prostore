import { getOrderById } from '@/lib/actions/order.action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type OrderDetailPageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata: Metadata = {
  title: 'Order Detail',
}

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  const { id } = await params

  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return <>Order Details</>
}

export default OrderDetailPage
