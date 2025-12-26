import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignUpForm from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign Up',
};

const SingUpPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SingUpPage;
