import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getOrderById } from '@/lib/actions/order.actions';

import { auth } from '@/auth';
import { ShippingAddress } from '@/types';

import OrderDetailsTable from './order-details-table';

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  return (
    <OrderDetailsTable
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === 'admin'}
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetailsPage;
