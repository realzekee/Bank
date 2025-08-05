'use client';

import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Target,
  Settings,
  Shield,
  LifeBuoy,
  CreditCard,
  Repeat,
  Bell,
  Banknote,
  Users,
  Home,
  ShoppingCart,
  Package,
  LineChart,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Logo } from './icons';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/transfer', label: 'Transfer', icon: CreditCard },
  { href: '/savings', label: 'Savings Goals', icon: Target },
  { href: '/reports', label: 'Reports', icon: LineChart },
  {
    href: '/admin',
    label: 'Admin',
    icon: Shield,
    adminOnly: true,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                <Logo className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">ZynPay</span>
            </Link>
            {navItems.map((item) =>
                (item.adminOnly && !user?.isAdmin) ? null : (
                    <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                        <Link
                            href={item.href}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                pathname === item.href && "bg-accent text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="sr-only">{item.label}</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                )
            )}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
            <TooltipTrigger asChild>
            <Link
                href="/settings"
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === "/settings" && "bg-accent text-accent-foreground"
                )}

            >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
            </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
        </nav>
        </TooltipProvider>
  </aside>
  );
}
