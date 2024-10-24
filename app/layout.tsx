import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { PlanProvider } from '@/lib/plan';
import { getUser, getUserPlan } from '@/lib/db/queries';
import Icon from './icon.svg';

export const metadata: Metadata = {
  title: 'disco.ai - Accelerate Your Sales with AI-Driven Insights',
  description: 'Get instant, actionable reports on any company. Empower your sales strategy with tailored value propositions.',
  keywords: 'SaaS Sales, AI-powered Insights, Targeted Sales Tactics, Cutting-edge AI Tools, Real-time Insights, Tailor-made Value Propositions',
  icons: {
    icon: Icon.src,
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getUser();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <UserProvider userPromise={Promise.resolve(initialUser)}>
          <PlanProvider planPromise={getUserPlan(initialUser?.id ?? 0)}>
            {children}
          </PlanProvider>
        </UserProvider>
      </body>
    </html>
  );
}
