'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Book } from '@/types';
import { initialBooks, initialMembers } from '@/lib/data';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookUp, UserCheck, Library, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import bookCovers from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { summarizeBook } from '@/ai/flows/summarize-book';
import { useToast } from '@/hooks/use-toast';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundBook = initialBooks.find(b => b.id === parseInt(id as string, 10));
      if (foundBook) {
        setBook(foundBook);
      } else {
        // Handle book not found, maybe redirect or show an error
        router.push('/catalog');
      }
    }
  }, [id, router]);

  const handleGenerateSummary = async () => {
    if (!book) return;
    setIsSummaryLoading(true);
    try {
      const result = await summarizeBook({ title: book.title, author: book.author });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate a summary. Please try again.',
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };
  
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const getMemberName = (memberId?: number) => {
    if (!memberId) return 'N/A';
    return initialMembers.find(m => m.id === memberId)?.name || 'Unknown Member';
  };

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date();
  }

  const featuredBookCover = bookCovers.bookCovers[10];

  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Button variant="outline" onClick={() => router.back()} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
        <Card className="glassmorphic overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1">
              <Image
                src={featuredBookCover.src}
                alt={book.title}
                width={featuredBookCover.width}
                height={featuredBookCover.height}
                data-ai-hint={featuredBookCover.hint}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-4xl">{book.title}</CardTitle>
                <CardDescription className="text-lg">by {book.author}</CardDescription>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Badge variant={book.status === 'Available' ? 'default' : (isOverdue(book.dueDate) ? 'destructive' : 'secondary')}>
                    {isOverdue(book.dueDate) ? 'Overdue' : book.status}
                  </Badge>
                  <Badge variant="outline">{book.genre}</Badge>
                   {book.reservations && book.reservations.length > 0 && (
                     <Badge variant="outline" className="flex items-center gap-1">
                        <Library className="h-3 w-3" /> 
                        {book.reservations.length} Reservation{book.reservations.length > 1 ? 's' : ''}
                     </Badge>
                   )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">ISBN</h4>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
                
                {book.status === 'Checked Out' && (
                  <div>
                    <h4 className="font-semibold mb-2">Borrower Details</h4>
                    <p className="text-muted-foreground">Checked out by: {getMemberName(book.memberId)}</p>
                    <p className="text-muted-foreground">Checkout Date: {book.checkoutDate ? new Date(book.checkoutDate).toLocaleDateString() : 'N/A'}</p>
                    <p className={cn("text-muted-foreground", isOverdue(book.dueDate) && "text-destructive font-semibold")}>
                        Due Date: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                )}
                
                {book.reservations && book.reservations.length > 0 && (
                   <div>
                    <h4 className="font-semibold mb-2">Reservation Queue</h4>
                    <ol className="list-decimal list-inside text-muted-foreground">
                        {book.reservations.map(memberId => (
                            <li key={memberId}>{getMemberName(memberId)}</li>
                        ))}
                    </ol>
                  </div>
                )}
                
                <Card className="bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                            AI-Generated Summary
                            <Button size="sm" variant="ghost" onClick={handleGenerateSummary} disabled={isSummaryLoading}>
                                {isSummaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                <span className="sr-only">Generate Summary</span>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isSummaryLoading && <p className="text-muted-foreground italic">Generating summary...</p>}
                        {!isSummaryLoading && summary && <p className="text-muted-foreground italic">"{summary}"</p>}
                        {!isSummaryLoading && !summary && <p className="text-muted-foreground italic">Click the sparkle to generate a summary for this book.</p>}
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    {book.status === 'Available' ? (
                        <Button><BookUp className="mr-2"/> Check Out</Button>
                    ) : (
                        <Button><UserCheck className="mr-2"/> Reserve</Button>
                    )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
