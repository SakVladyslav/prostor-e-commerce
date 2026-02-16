import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getOrderById } from "@/lib/actions/order.actions";

export const metadata: Metadata = {
    title: 'Order Details'
}

const OrderDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const order = await getOrderById(id);
    if (!order) notFound();

    return (
        <div>
            Details {order.totalPrice}
        </div>
    );
};

export default OrderDetailsPage;