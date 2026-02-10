'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Loader, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { addToCart, removeFromCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';

const QuantityChangingBlock = ({ item }: { item: CartItem }) => {
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

  return (
    <div className="flex justify-items-center items-center">
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
      <span className="px-2">{item.qty}</span>
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
  );
};

export default QuantityChangingBlock;
