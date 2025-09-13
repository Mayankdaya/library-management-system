import Link from 'next/link';
import { BookMarked, Users, BookOpen, User, Star, MessageSquareQuote } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className={cn("glassmorphic sticky top-0 left-0 right-0 z-30")}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-foreground" />
          <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/catalog" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
            <BookOpen className="h-5 w-5" />
            <span>Full Catalog</span>
          </Link>
          <Link href="/members" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
            <Users className="h-5 w-5" />
            <span>Members</span>
          </Link>
           <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
            <MessageSquareQuote className="h-5 w-5" />
            <span>Community</span>
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
            <span className="sr-only">My Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
