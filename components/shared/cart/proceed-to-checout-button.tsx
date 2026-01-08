'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { ArrowRight, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';

const ProceedToCheckoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = () => {
    startTransition(() => router.push('/shipping-address'));
  };

  return (
    <Button className="w-full" disabled={isPending} onClick={handleCheckout}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <ArrowRight className="w-4 h-4" />
      )}{' '}
      Proceed to Checkout
    </Button>
  );
};

export default ProceedToCheckoutButton;
