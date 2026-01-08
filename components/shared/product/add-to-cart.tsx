'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { addToCart, removeFromCart } from '@/lib/actions/cart.actions';

import { toast } from 'sonner';
import { Minus, Plus, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';

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

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast(res.message);

      return;
    });
  };

  const existItem =
    cart && cart.items.find((product) => product.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        disabled={isPending}
        type="button"
        onClick={handleRemoveFromCart}
        variant="outline"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        disabled={isPending}
        type="button"
        onClick={handleAddToCart}
        variant="outline"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      variant="outline"
    >
      <Plus />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
