'use client';
import { useRouter } from 'next/navigation';

import { addToCart } from '@/lib/actions/cart.actions';

import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${item.name} added to cart`, {
      action: {
        label: 'Go to cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  return (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      variant="outline"
      size="icon"
    >
      <Plus />
      Add To Cart
    </Button>
  );
};

export default AddToCart;
