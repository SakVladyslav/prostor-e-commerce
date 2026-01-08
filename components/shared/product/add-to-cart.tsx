'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { addToCart } from '@/lib/actions/cart.actions';
import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';

import QuantityChangingBlock from '../cart/change-quantity-block';

const AddToCart = ({ item, cart }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast(res.message, {
        action: {
          label: 'Go to cart',
          onClick: () => router.push('/cart'),
        },
      });

      return;
    });
  };

  const existItem =
    cart && cart.items.find((product) => product.productId === item.productId);

  return existItem ? (
    <QuantityChangingBlock item={existItem} />
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={handleAddToCart}
      variant="outline"
    >
      <Plus />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
