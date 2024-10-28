import Link from 'next/link';

import { UserOptions } from './userOptions';
import Icon from '@/app/icon.svg';
import { Sidebar } from './sideBar';
import Image from 'next/image';

interface NavbarProps {
    pathname: string;
    user: any;
}

export function Navbar() {
    return (
        <header className="bg-white border-b fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-16">
                <div className="absolute top-4 left-[50vw] z-50 translate-x-[-50%] static">
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
                <UserOptions />
            </div>
        </header>
    );
}
