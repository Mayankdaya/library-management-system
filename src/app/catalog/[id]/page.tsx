
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Book, Review, Member } from '@/types';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookUp, UserCheck, Library, Loader2, Sparkles, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import bookCovers from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCheckout } from '@/hooks/use-checkout.tsx';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { generateSummary } from '@/ai/flows/generate-summary-flow';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const { checkoutItems, addToCheckout } = useCheckout();

  const [book, setBook] = useState<Book | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', memberId: '' });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);

  const isBookInCheckout = book ? checkoutItems.some(item => item.id === book.id) : false;

  useEffect(() => {
    if (id) {
      const fetchBookAndMembers = async () => {
        try {
          // Fetch members first
          const membersCollection = collection(db, "members");
          const membersSnapshot = await getDocs(membersCollection);
          const membersData = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
          setMembers(membersData);
          
          // Fetch book
          const bookRef = doc(db, 'books', id as string);
          const bookSnap = await getDoc(bookRef);

          if (bookSnap.exists()) {
            const bookData = { id: bookSnap.id, ...bookSnap.data() } as Book;
            
            // Fetch reviews for the book
            const reviewsCol = collection(db, `books/${id}/reviews`);
            const reviewsSnap = await getDocs(reviewsCol);
            const reviewsData = reviewsSnap.docs.map(reviewDoc => {
                const review = { id: reviewDoc.id, ...reviewDoc.data()} as Review;
                review.member = membersData.find(m => m.id === review.memberId);
                return review;
            });

            bookData.reviews = reviewsData;
            setBook(bookData);
            setReviews(reviewsData);

            if (reviewsData.length > 0) {
              const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
              setAvgRating(totalRating / reviewsData.length);
            }

          } else {
            console.error("No such book!");
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load book details.' });
            router.push('/catalog');
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load book details.' });
        }
      };
      
      fetchBookAndMembers();
    }
  }, [id, router, toast]);

  const handleGenerateSummary = async () => {
    if (!book) return;
    setIsSummaryLoading(true);
    try {
        const generated = await generateSummary({ title: book.title, author: book.author });
        setSummary(generated);
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "AI Summary Failed",
            description: "Could not generate a summary for this book. Please try again."
        });
        setSummary("");
    } finally {
        setIsSummaryLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || newReview.rating === 0 || !newReview.comment || !newReview.memberId) {
        toast({
            variant: 'destructive',
            title: 'Incomplete Review',
            description: 'Please select a member, a rating, and write a comment.',
        });
        return;
    }
    
    try {
        const reviewToInsert = {
          bookId: book.id,
          memberId: newReview.memberId,
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toISOString(),
        }
        
        const reviewCol = collection(db, `books/${book.id}/reviews`);
        const docRef = await addDoc(reviewCol, reviewToInsert);

        const member = members.find(m => m.id === newReview.memberId);
        const newReviewData: Review = { ...reviewToInsert, id: docRef.id, member };
        
        const updatedReviews = [...reviews, newReviewData];
        setReviews(updatedReviews);

        const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        setAvgRating(totalRating / updatedReviews.length);
        
        setNewReview({ rating: 0, comment: '', memberId: '' });
        toast({
            title: 'Review Submitted',
            description: 'Thank you for your feedback!',
        });
    } catch (error) {
        console.error("Error submitting review:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not submit review.',
        });
    }
  };

  const handleAddToCart = () => {
    if (book) {
      addToCheckout(book);
      toast({
        title: 'Added to Checkout',
        description: `"${book.title}" has been added to your checkout list.`,
      });
    }
  };
  
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const getMemberName = (memberId?: string) => {
    if (!memberId) return 'N/A';
    return members.find(m => m.id === memberId)?.name || 'Unknown Member';
  };
  
  const getMemberInitials = (member?: Member) => {
      if (!member || !member.name) return 'U';
      const name = member.name;
      if (name === 'N/A' || name === 'Unknown Member') return 'U';
      return name.split(' ').map(n => n[0]).join('');
  }
  
  const isOverdue = (dueDate?: string | { toDate: () => Date }) => {
    if (!dueDate) return false;
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate.toDate();
    return date < new Date();
  };
  
  const formatDate = (date?: string | { toDate: () => Date }) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date.toDate();
    return d.toLocaleDateString();
  };

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
                    <p className="text-muted-foreground">Checkout Date: {formatDate(book.checkoutDate)}</p>
                    <p className={cn("text-muted-foreground", isOverdue(book.dueDate) && "text-destructive font-semibold")}>
                        Due Date: {formatDate(book.dueDate)}
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
                        <Button onClick={handleAddToCart} disabled={isBookInCheckout}>
                            <ShoppingCart className="mr-2 h-4 w-4" /> 
                            {isBookInCheckout ? 'Added to Checkout' : 'Add to Checkout'}
                        </Button>
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
                            {reviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((review) => (
                                <div key={review.id} className="flex items-start gap-4 border-b border-border pb-4 last:border-b-0">
                                    <Avatar>
                                        <AvatarFallback>{getMemberInitials(review.member)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex-1'>
                                        <div className="flex items-center justify-between">
                                            <p className='font-semibold'>{review.member?.name || 'Anonymous'}</p>
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
                                    {members.map(member => (
                                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
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
