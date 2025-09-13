'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Book, Review } from '@/types';
import { initialBooks, initialMembers } from '@/lib/data';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookUp, UserCheck, Library, Loader2, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import bookCovers from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { summarizeBook } from '@/ai/flows/summarize-book';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', memberId: '' });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (id) {
      const foundBook = initialBooks.find(b => b.id === parseInt(id as string, 10));
      if (foundBook) {
        setBook(foundBook);
        const initialReviews = foundBook.reviews || [];
        setReviews(initialReviews);
        if (initialReviews.length > 0) {
            const totalRating = initialReviews.reduce((acc, review) => acc + review.rating, 0);
            setAvgRating(totalRating / initialReviews.length);
        }
      } else {
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment || !newReview.memberId) {
        toast({
            variant: 'destructive',
            title: 'Incomplete Review',
            description: 'Please select a member, a rating, and write a comment.',
        });
        return;
    }
    const review: Review = {
        memberId: parseInt(newReview.memberId),
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
    };
    
    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    
    // Update the book in the global state (for demo purposes)
    const bookIndex = initialBooks.findIndex(b => b.id === book!.id);
    if(bookIndex !== -1) {
        initialBooks[bookIndex].reviews = updatedReviews;
    }

    const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
    setAvgRating(totalRating / updatedReviews.length);
    
    setNewReview({ rating: 0, comment: '', memberId: '' });
    toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
    });
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
  
  const getMemberInitials = (memberId: number) => {
      const name = getMemberName(memberId);
      if (name === 'N/A' || name === 'Unknown Member') return 'U';
      return name.split(' ').map(n => n[0]).join('');
  }

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date();
  }

  const cover = book.coverImage 
    ? { src: book.coverImage, width: 800, height: 1200, hint: 'ai generated' } 
    : bookCovers.bookCovers[10];

  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24 space-y-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
        <Card className="glassmorphic overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1">
              <Image
                src={cover.src}
                alt={book.title}
                width={cover.width}
                height={cover.height}
                data-ai-hint={cover.hint}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-4xl">{book.title}</CardTitle>
                <CardDescription className="text-lg">by {book.author}</CardDescription>
                <div className="flex flex-wrap items-center gap-4 pt-2">
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
                   {reviews.length > 0 && (
                     <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{avgRating.toFixed(1)} ({reviews.length} review{reviews.length > 1 ? 's' : ''})</span>
                     </div>
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
        
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Ratings & Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    {reviews.length === 0 ? (
                        <p className="text-muted-foreground italic">No reviews yet. Be the first to leave one!</p>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {reviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((review, index) => (
                                <div key={index} className="flex items-start gap-4 border-b border-border pb-4 last:border-b-0">
                                    <Avatar>
                                        <AvatarFallback>{getMemberInitials(review.memberId)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex-1'>
                                        <div className="flex items-center justify-between">
                                            <p className='font-semibold'>{getMemberName(review.memberId)}</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("h-4 w-4", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{new Date(review.date).toLocaleDateString()}</p>
                                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Leave a Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                         <div>
                            <Label htmlFor="member-select">Select Member</Label>
                             <Select
                                value={newReview.memberId}
                                onValueChange={(value) => setNewReview({ ...newReview, memberId: value })}
                            >
                                <SelectTrigger id="member-select" className="w-full mt-2">
                                    <SelectValue placeholder="Select a member to review as..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialMembers.map(member => (
                                        <SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Rating</Label>
                            <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                     <Button 
                                        key={i} 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                                    >
                                        <Star className={cn("h-6 w-6", i < newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50")} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                className="mt-2"
                                placeholder="What did you think of the book?"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full">Submit Review</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
