'use client';

import { useTransition } from 'react';

import { updateOrderToPaidCOD } from '@/lib/actions/order.actions';

import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

const MarkAsPaidButton = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(id);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
    });
  };

  return (
    <Button type="button" disabled={isPending} onClick={handleMarkAsPaid}>
      {isPending ? 'Processing...' : 'Mark as Paid'}
    </Button>
  );
};

export default MarkAsPaidButton;
