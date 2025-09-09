import { BookMarked } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <BookMarked className="h-8 w-8 text-accent" />
        <h1 className="text-3xl font-headline font-bold">Verdant Library</h1>
      </div>
    </header>
  );
}
