import Link from 'next/link';
import { BookMarked, Users, BookOpen, User, ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="bg-transparent text-primary-foreground absolute top-0 left-0 right-0 z-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/catalog" className="flex items-center gap-2 hover:text-accent transition-colors font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>Full Catalog</span>
          </Link>
          <Link href="/members" className="flex items-center gap-2 hover:text-accent transition-colors font-semibold">
            <Users className="h-5 w-5" />
            <span>Members</span>
          </Link>
           <Link href="#" className="flex items-center gap-2 hover:text-accent transition-colors font-semibold">
            <Star className="h-5 w-5" />
            <span>Featured</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
            <span className="sr-only">My Account</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Checkout</span>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
          </Button>
        </div>
      </div>
    </header>
  );
}