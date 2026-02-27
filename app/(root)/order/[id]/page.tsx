import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getOrderById } from '@/lib/actions/order.actions';

import { auth } from '@/auth';
import { ShippingAddress } from '@/types';

import OrderDetailsTable from './order-details-table';

import Stripe from 'stripe';

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

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === 'admin'}
      stripeClientSecret={client_secret}
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetailsPage;
