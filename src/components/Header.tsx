import Link from 'next/link';
import { BookMarked, Users, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-transparent text-primary-foreground absolute top-0 left-0 right-0 z-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/catalog" className="flex items-center gap-2 hover:text-accent transition-colors">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">Catalog</span>
          </Link>
          <Link href="/members" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-semibold">Members</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
