import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Target, Zap, BarChart, Upload, SearchCheckIcon, SearchIcon, BarChart2 } from 'lucide-react';
import { Terminal } from './(dashboard)/terminal';
import Image from 'next/image';
import Icon from '@/app/icon.svg';
import HeroAnimation from '@/components/ui/hero-animation';

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-3">
          <div className="flex flex-col lg:flex-row lg:flex-row lg:gap-8">
            <div className="text-center md:max-w-2xl sm:mx-auto lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                What if you used AI
                <span className="block text-blue-600">to research your prospects?</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Get instant, actionable reports on any company. Tailored to your product's use case.
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
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0  lg:mx-0 lg:col-span-3 lg:flex lg:items-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <Upload className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  We know your product
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  You've spent enough time writing product docs. Let AI do the heavy lifting and identify your Target Audience, Use Cases, Key Features, and more.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <SearchIcon className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  We know your customers
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Disco AI will search for the information you need know to based on the problems you solve.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <BarChart2 className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  So you
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Enter sales calls with a clear understanding of the company's needs. And how your product can help.
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