import Link from 'next/link';
import { BookMarked, Users } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-transparent text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
        </Link>
        <nav>
          <Link href="/members" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-semibold">Members</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
