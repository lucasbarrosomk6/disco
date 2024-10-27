'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import Icon from '@/app/icon.svg';
import { useUser } from '@/lib/auth';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    console.log('signing out')
    setUser(null);
    await signOut();
    router.push('/');
  }

  return (
    <header className="border-b border-gray-200">
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

    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen max-h-screen">
      {children}
    </section>
  );
}
