import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Target, Zap, BarChart } from 'lucide-react';
import { Terminal } from './terminal';
import Image from 'next/image';
import Icon from '@/app/icon.svg';

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Image
                  src={Icon}
                  alt="disco.ai logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
                <span className="ml-2 text-2xl font-semibold text-gray-900">disco.ai</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Accelerate Your Sales
                <span className="block text-blue-600">with AI-Driven Company Insights</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Get instant, actionable reports on any company. Empower your sales strategy with tailored value propositions.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a href="/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg px-8 py-6 inline-flex items-center justify-center">
                    Try Disco.ai for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <Search className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Instant Company Reports
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Generate detailed reports that highlight a company's key initiatives, challenges, and opportunities.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <Target className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Personalized Value Propositions
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Input your product details, and our AI aligns your offerings with the prospect's specific needs.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <BarChart className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Data Retention for Enhanced Matching
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Every report contributes to a growing database, improving future recommendations and insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to revolutionize your sales process?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Join the growing number of sales professionals using disco.ai to supercharge their research and close more deals.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  Start Your Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}