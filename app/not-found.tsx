import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/app/icon.svg';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center mb-8">
        <Image
          src={Icon}
          alt="disco.ai logo"
          width={48}
          height={48}
          className="h-12 w-12"
        />
        <span className="ml-2 text-3xl font-semibold text-gray-900">disco.ai</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go back home
      </Link>
    </div>
  );
}
