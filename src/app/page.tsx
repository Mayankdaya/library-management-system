"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, User, ShoppingCart, Star } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Book } from '@/types';
import { initialBooks } from '@/lib/data';
import { bookCovers } from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';

export default function PremiumHomePage() {
  const newArrivals = initialBooks.slice(0, 5);
  const mostPopular = [...initialBooks].reverse().slice(0, 5);
  const staffPicks = [initialBooks[1], initialBooks[3], initialBooks[5], initialBooks[0], initialBooks[4]];

  const BookCard = ({ book, cover }: { book: Book; cover: {src: string, width: number, height: number, hint: string} }) => (
    <div className="space-y-3">
      <Card className="overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 ease-in-out group">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={cover.src}
              alt={`Cover of ${book.title}`}
              width={cover.width}
              height={cover.height}
              className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={cover.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2">
              <Badge variant={book.status === 'Available' ? 'default' : 'secondary'}>
                {book.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center">
        <p className="font-semibold truncate">{book.title}</p>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </div>
    </div>
  );

  const BookCarouselSection = ({ title, books }: { title: string; books: Book[] }) => (
    <section className="py-12">
      <h2 className="text-3xl font-headline font-bold mb-8">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {books.map((book, index) => (
            <CarouselItem key={book.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
              <BookCard book={book} cover={bookCovers[book.id % bookCovers.length]} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='-left-4 md:-left-12' />
        <CarouselNext className='-right-4 md:-right-12' />
      </Carousel>
    </section>
  );


  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center -mt-20">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-background via-card to-background opacity-80"
          />
          <Image 
            src="https://picsum.photos/seed/library-hero/1920/1080" 
            alt="A modern library"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 -z-10 opacity-20"
            data-ai-hint="modern library"
          />
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 bg-opacity-50 font-headline mb-6">
              Discover Your Next Chapter
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral-300 mb-10">
              Explore a universe of stories, knowledge, and adventure. Your gateway to our extensive collection awaits.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for books, authors, or genres..."
                className="w-full h-14 pl-12 pr-4 text-lg bg-card/80 backdrop-blur-sm border-2 border-primary/50 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Library Sections */}
        <div className="container mx-auto px-4 py-16">
          <BookCarouselSection title="New Arrivals" books={newArrivals} />
          <BookCarouselSection title="Most Popular" books={mostPopular} />
          <BookCarouselSection title="Staff Recommendations" books={staffPicks} />
        </div>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Verdant Library. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}