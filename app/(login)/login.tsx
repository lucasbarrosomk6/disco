'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import type { ActionState } from '@/lib/auth/middleware';

export function Login({ mode }: { mode: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-screen flex flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          {mode === 'signin' ? 'Sign in to your account' : 'Create an account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect ?? ''} />
            <input type="hidden" name="priceId" value={priceId ?? ''} />
            <input type="hidden" name="inviteId" value={inviteId ?? ''} />

            <div>
              <Label htmlFor="email-address" className="block text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {state?.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{state?.error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </Button>
            </div>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-muted rounded-md shadow-sm bg-background text-sm font-medium text-muted-foreground hover:bg-muted focus:outline-none"
              onClick={() => {
                // Handle Google login action
              }}
            >
              Sign in with Google
            </Button>
          </div>

          <p className="flex flex-col items-center mt-6 text-center text-sm text-background/80">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <Link href="/sign-up" className="font-medium text-primary hover:text-primary/90">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="/sign-in" className="font-medium text-primary hover:text-primary/90">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
