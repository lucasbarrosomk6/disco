import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Settings,
    Users,
    Shield,
    Activity,
    Home,
    Package,
} from 'lucide-react';

interface NavItem {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

interface SidebarProps {
    pathname: string;
    user: any;
}

export function Sidebar({ pathname, user }: SidebarProps) {
    const navItems: NavItem[] = [
        { href: '/dashboard', icon: Home, label: 'Overview' },
        { href: '/dashboard/products', icon: Package, label: 'Products' },
    ];

    const optionsItems: NavItem[] = [
        { href: '/dashboard/team', icon: Users, label: 'Team' },
        { href: '/dashboard/general', icon: Settings, label: 'General' },
        { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
        { href: '/dashboard/security', icon: Shield, label: 'Security' },
    ];



    return (
        <aside className="w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0">
            <nav className="h-full overflow-y-auto p-4">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={pathname === item.href ? 'secondary' : 'ghost'}
                            className={`my-1 w-full justify-start ${pathname === item.href
                                ? 'bg-blue-100 text-blue-600'
                                : 'hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
                {/* Options Section */}
                <div className="mt-4">
                    <div className="flex items-center text-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Options
                    </div>
                    <div className="ml-4 mt-2">
                        {optionsItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                                    className={`my-1 w-full justify-start ${pathname === item.href
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </aside>
    );
}
