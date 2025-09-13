
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Settings, ShoppingCart } from 'lucide-react';
import React from 'react';
import { useCheckout } from '@/hooks/use-checkout.tsx';


export const BookMarkedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
    </svg>
);

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const MessageSquareQuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 12h.01"></path><path d="M12 12h.01"></path><path d="M16 12h.01"></path>
    </svg>
);

export default function Header() {
  const { checkoutItems } = useCheckout();

  return (
    <header className={cn("glassmorphic sticky top-0 left-0 right-0 z-30")}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BookMarkedIcon className="h-8 w-8 text-foreground" />
          <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
            <Link href="/catalog" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
              <BookOpenIcon className="h-5 w-5" />
              <span>Full Catalog</span>
            </Link>
            <Link href="/members" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
              <UsersIcon className="h-5 w-5" />
              <span>Members</span>
            </Link>
            <Link href="/community" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
              <MessageSquareQuoteIcon className="h-5 w-5" />
              <span>Community</span>
            </Link>
        </nav>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/checkout" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {checkoutItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {checkoutItems.length}
                  </span>
                )}
                <span className="sr-only">Checkout</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                  <Settings className="h-6 w-6" />
                  <span className="sr-only">Settings</span>
              </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
