// active-link.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActiveLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    segment?: string;
}

export function ActiveLink({ href, icon: Icon, label, segment = '' }: ActiveLinkProps) {
    console.log(segment);
    // Convert both to same format for comparison
    const isActive = segment === href.split('/').pop();

    return (
        <Link href={href} passHref>
            <Button
                variant="ghost"
                className={`my-1 w-full justify-start hover:bg-blue-50 hover:text-blue-600
                    ${isActive ? 'bg-blue-100 text-blue-600' : ''}`}
            >
                <Icon className="mr-2 h-4 w-4" />
                {label}
            </Button>
        </Link>
    );
}
