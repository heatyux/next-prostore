import { getOrderById } from '@/lib/actions/order.action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './order-details-table'
import { ShippingAddress } from '@/types'
import { auth } from '@/auth'

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

  const session = await auth()

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user.role === 'admin' || false}
      />
    </>
  )
}

export default OrderDetailPage
