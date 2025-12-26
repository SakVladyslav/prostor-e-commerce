'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { signUpDefaultValue } from '@/lib/constants';
import { signUpUser } from '@/lib/actions/user.actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className="w-full" variant="default">
      {pending ? 'Submitting...' : 'Sign Up'}
    </Button>
  );
};

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label className="mb-2" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValue.email}
          />
        </div>

        <div>
          <Label className="mb-2" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="text"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValue.email}
          />
        </div>

        <div>
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signUpDefaultValue.email}
          />
        </div>

        <div>
          <Label className="mb-2" htmlFor="confirmPassword">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValue.email}
          />
        </div>

        <div>
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" target="_self" className="link hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
