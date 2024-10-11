import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth/index';  // Update this line
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();
  let planPromise = userPromise.then(user => user ? getUserPlan(user.id) : null);

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <UserProvider userPromise={userPromise}>
          <PlanProvider planPromise={planPromise}>
            {children}
          </PlanProvider>
        </UserProvider>
      </body>
    </html>
  );
}
