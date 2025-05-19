import { getOrderById } from '@/lib/actions/order.action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './order-details-table'
import { ShippingAddress } from '@/types'

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

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      />
    </>
  )
}

export default OrderDetailPage
