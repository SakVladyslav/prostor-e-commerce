import { getMyCart } from '@/lib/actions/cart.actions';

import CartTable from './cart-table';

export const metadata = {
  title: 'Shopping Cart',
};

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
