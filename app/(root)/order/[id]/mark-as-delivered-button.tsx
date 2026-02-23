import { useTransition } from 'react';

import { deliverOrder } from '@/lib/actions/order.actions';

import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

const MarkAsDeliveredButton = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(id);

          if (!res.success) {
            toast.error(res.message);
            return;
          }

          toast.success(res.message);
        })
      }
    >
      {isPending ? 'Processing...' : 'Mark as Delivered'}
    </Button>
  );
};

export default MarkAsDeliveredButton;
