import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { PlanProvider } from '@/lib/plan';
import { getUser, getUserPlan } from '@/lib/db/queries';
import Icon from './icon.svg';
import { Navbar } from '@/components/ui/navBar';
import Link from 'next/link';
import Image from 'next/image';


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
            <Navbar />
            <div className="absolute top-4 left-[50vw] z-50 translate-x-[-50%]">
              <Link href="/" className="flex items-center">
                <Image
                  src={Icon}
                  alt="disco.ai logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="ml-2 text-xl font-semibold text-gray-900">disco.ai</span>
              </Link>
            </div>

            {children}
          </PlanProvider>
        </UserProvider>
      </body>
    </html>
  );
}
