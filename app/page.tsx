import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Target, Zap, BarChart, Upload, SearchCheckIcon, SearchIcon, BarChart2 } from 'lucide-react';
import { Terminal } from './(dashboard)/terminal';
import Image from 'next/image';
import Icon from '@/app/icon.svg';
import HeroAnimation from '@/components/ui/hero-animation';
import FeatureGrid from '@/components/ui/feature-grid';

export default function HomePage() {
  return (
    <main>
      <section className="min-h-[100dvh] flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-3">
          <div className="flex flex-col items-center lg:gap-8">
            <div className="text-center  ">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl md:text-5xl">
                What if you used AI
                <span className="block text-blue-600">to research your prospects?</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg lg:text-xl">
                Get instant, actionable reports on any company. Tailored to your product's use case.
              </p>
              <div className="mt-8 sm:mx-auto text-center ">
                <a href="/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg px-6 py-4 sm:px-8 sm:py-6 inline-flex items-center justify-center">
                    Try Disco.ai for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:mx-0 lg:col-span-3 lg:flex lg:items-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid />

      <br />
    </main>
  );
}
