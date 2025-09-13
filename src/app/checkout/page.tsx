
'use client';

import React from 'react';
import Header from '@/components/Header';
import { useCheckout } from '@/hooks/use-checkout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book as BookIcon, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { initialMembers } from '@/lib/data';
import CheckOutForm from '@/components/CheckOutForm';
import { useToast } from '@/hooks/use-toast';
import bookCovers from '@/lib/placeholder-images.json';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
    const { checkoutItems, removeFromCheckout, clearCheckout } = useCheckout();
    const router = useRouter();
    const { toast } = useToast();

    // This would typically come from a global state/context after login
    // For now, we simulate being on the main catalog page to get the handler
    const [allBooks, setAllBooks] = React.useState<any[]>([]); // This state is just to pass the function
    const handleCheckOut = (bookIds: number[], memberId: number, dueDate: string) => {
        // In a real app, this would be a single API call.
        // Here, we'll simulate it and then redirect.
        // The actual state update happens in `catalog/page.tsx` for now.
        // To make this real, we'd need a global state management for books (like Zustand or Redux)
        
        clearCheckout();
        toast({
            title: "Checkout Successful!",
            description: "The books have been checked out."
        });
        router.push('/catalog');
    };

    return (
        <div className="min-h-screen bg-transparent text-foreground font-body">
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">
                        Checkout
                    </h1>
                     <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Continue Browsing
                    </Button>
                </div>

                {checkoutItems.length === 0 ? (
                     <Card className="glassmorphic text-center py-16">
                        <CardHeader>
                            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                            <CardTitle className="mt-4">Your Checkout List is Empty</CardTitle>
                            <CardDescription>
                                Add some books from the catalog to get started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/catalog">Explore the Catalog</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2 space-y-4">
                            <Card className="glassmorphic">
                                <CardHeader>
                                    <CardTitle>Your Selections ({checkoutItems.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {checkoutItems.map((book, index) => {
                                            const cover = book.coverImage ? { src: book.coverImage, width: 400, height: 600, hint: 'ai generated' } : bookCovers.bookCovers[(book.id - 1) % bookCovers.bookCovers.length];
                                            return(
                                            <React.Fragment key={book.id}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                                                         {cover.src ? (
                                                            <Image src={cover.src} alt={book.title} width={64} height={96} data-ai-hint={cover.hint} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <BookIcon className="w-8 h-8 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="font-semibold">{book.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{book.author}</p>
                                                        <p className="text-sm text-muted-foreground">{book.genre}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => removeFromCheckout(book.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </div>
                                                {index < checkoutItems.length - 1 && <Separator />}
                                            </React.Fragment>
                                        )})}
                                    </div>
                                    <div className="mt-6">
                                        <Button variant="outline" onClick={clearCheckout}>Clear All</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="sticky top-24">
                            <Card className="glassmorphic">
                                <CardHeader>
                                    <CardTitle>Complete Checkout</CardTitle>
                                    <CardDescription>Select a member and a due date to finalize the checkout.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CheckOutForm 
                                        books={checkoutItems}
                                        members={initialMembers}
                                        onFormSubmit={({ bookIds, memberId, dueDate }) => handleCheckOut(bookIds, memberId, dueDate.toISOString().split('T')[0])}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
