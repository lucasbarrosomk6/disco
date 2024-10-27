import Link from 'next/link';

import { UserOptions } from './userOptions';
import Icon from '@/app/icon.svg';
import { Sidebar } from './sideBar';

interface NavbarProps {
    pathname: string;
    user: any;
}

export function Navbar() {
    return (
        <header className="bg-white border-b fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-16">

                <UserOptions />
            </div>
        </header>
    );
}
