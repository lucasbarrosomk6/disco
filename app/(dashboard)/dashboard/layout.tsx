// dashboard-layout.tsx
import { ActiveLink } from '@/components/dashboard/active-link';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, Activity, Package, ChevronDown, Home, Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { segment?: string[] };
}) {
  const segment = params.segment?.[0] || '';
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Overview' },
    { href: '/dashboard/products', icon: Package, label: 'Products' },
  ];

  const optionsItems = [
    { href: '/dashboard/team', icon: Users, label: 'Team' },
    { href: '/dashboard/general', icon: Settings, label: 'General' },
    { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
    { href: '/dashboard/security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="flex flex-1 overflow-hidden mt-16 h-full">
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />


      <label htmlFor="sidebar-toggle" className="absolute top-2 left-2 w-12 h-12 z-50 cursor-pointer flex items-center justify-center lg:hidden">
        <Menu className="h-6 w-6 text-gray-600 peer-checked:hidden" />
        <X className="h-6 w-6 text-gray-600 hidden peer-checked:block" />
      </label>

      <aside className="w-64 bg-white lg:bg-gray-50 border-r border-gray-200 block peer-checked:hidden">
        <nav className="h-full overflow-y-auto p-4">
          {navItems.map((item) => (
            <ActiveLink
              key={item.href}
              {...item}
              segment={segment}
            />
          ))}
          <div>
            <Button
              variant="ghost"
              className="my-1 w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Options
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
            <div className="ml-4">
              {optionsItems.map((item) => (
                <ActiveLink
                  key={item.href}
                  {...item}
                  segment={segment}
                />
              ))}
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {children}
      </main>
    </div>
  );
}