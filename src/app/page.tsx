"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Spotlight } from '@/components/ui/spotlight';
import { cn } from '@/lib/utils';
import { CheckCircle, BookOpen, User, Star } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { initialBooks } from '@/lib/data';
import bookCovers from '@/lib/placeholder-images.json';

export default function PremiumHomePage() {
  const features = [
    { text: "Discover New Releases: Browse our latest arrivals and trending titles across genres." },
    { text: "Personalized Recommendations: Get tailored book suggestions based on your reading preferences." },
    { text: "Join Our Community: Participate in book clubs, author events, and reading challenges." },
    { text: "Digital & Physical Collections: Access eBooks, audiobooks, and print editions—all in one place." },
    { text: "24/7 Online Access: Enjoy seamless reading anytime, anywhere with our digital library." },
  ];

  const newArrivals = initialBooks.slice(0, 5);
  const popularTitles = initialBooks.slice(5, 10);

  const testimonials = [
    {
      quote: "Verdant Library has completely transformed my reading habits. The selection is incredible, and the personalized recommendations are always spot-on!",
      name: "Alex Johnson",
      title: "Avid Reader"
    },
    {
      quote: "As a student, having access to such a vast digital collection has been a lifesaver. The platform is intuitive and beautiful to use.",
      name: "Samantha Lee",
      title: "University Student"
    },
    {
      quote: "The community features are fantastic. I've joined a book club and attended several virtual author events. It's more than just a library; it's a community.",
      name: "Michael Chen",
      title: "Book Club Enthusiast"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-transparent text-foreground font-body">
      <Header />
      <main className="w-full rounded-md flex flex-col items-center justify-center bg-transparent antialiased relative overflow-hidden pt-24 pb-12">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="hsl(var(--primary))"
        />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full text-center">
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 font-headline">
            Verdant Library <br /> Your Gateway to Knowledge.
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-2xl mx-auto">
            Explore a universe of stories, knowledge, and adventure. Your next chapter awaits in our extensive collection.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-primary/80 hover:bg-primary text-primary-foreground">
                Explore the Collection
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 max-w-7xl mx-auto relative z-10 w-full p-4">
            <div className="glassmorphic p-8 md:p-12">
                <ul className="space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary/80 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-lg text-left">{feature.text}</span>
                    </li>
                ))}
                </ul>
                <p className="mt-8 text-center font-semibold text-xl text-primary/90">
                    Start your journey today—unlock endless possibilities with Verdant Library.
                </p>
            </div>
        </div>

        <div className="mt-24 max-w-7xl mx-auto z-10 w-full p-4">
          <section className="glassmorphic p-8 md:p-12">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">New Arrivals</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {newArrivals.map((book, index) => (
                  <CarouselItem key={book.id} className="md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-transparent border-none shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-0">
                        <Image 
                          src={bookCovers.bookCovers[index].src} 
                          alt={book.title} 
                          width={bookCovers.bookCovers[index].width}
                          height={bookCovers.bookCovers[index].height}
                          data-ai-hint={bookCovers.bookCovers[index].hint}
                          className="rounded-lg shadow-2xl h-64 w-auto object-cover" 
                        />
                        <h3 className="font-semibold mt-4 text-center">{book.title}</h3>
                        <p className="text-sm text-muted-foreground text-center">{book.author}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[-1rem] md:left-[-2rem]" />
              <CarouselNext className="right-[-1rem] md:right-[-2rem]" />
            </Carousel>
          </section>
        </div>
        
        <div className="mt-24 max-w-7xl mx-auto z-10 w-full p-4">
          <section className="glassmorphic p-8 md:p-12">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Popular Titles</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {popularTitles.map((book, index) => (
                  <CarouselItem key={book.id} className="md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-transparent border-none shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-0">
                        <Image 
                          src={bookCovers.bookCovers[index + 5].src} 
                          alt={book.title}
                          width={bookCovers.bookCovers[index + 5].width}
                          height={bookCovers.bookCovers[index + 5].height}
                          data-ai-hint={bookCovers.bookCovers[index + 5].hint}
                          className="rounded-lg shadow-2xl h-64 w-auto object-cover" 
                        />
                        <h3 className="font-semibold mt-4 text-center">{book.title}</h3>
                        <p className="text-sm text-muted-foreground text-center">{book.author}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[-1rem] md:left-[-2rem]" />
              <CarouselNext className="right-[-1rem] md:right-[-2rem]" />
            </Carousel>
          </section>
        </div>

        <div className="mt-24 max-w-5xl mx-auto z-10 w-full p-4">
          <h2 className="text-3xl font-bold font-headline mb-8 text-center">What Our Members Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="glassmorphic">
                        <CardContent className="pt-6">
                            <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                            <p className="mt-4 font-bold text-right text-primary/90">&mdash; {testimonial.name}</p>
                            <p className="text-sm text-muted-foreground text-right">{testimonial.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="mt-24 max-w-4xl mx-auto z-10 w-full p-4">
          <div className="glassmorphic p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-headline mb-4">Ready to Dive In?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of readers and start your next literary adventure today. Our collection is waiting for you.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="bg-primary/80 hover:bg-primary text-primary-foreground text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse the Full Catalog
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full z-10 p-8 glassmorphic mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg font-headline mb-4">Verdant Library</h3>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Verdant Library. All Rights Reserved.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg font-headline mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/catalog" className="text-sm hover:text-primary transition-colors">Catalog</Link></li>
              <li><Link href="/members" className="text-sm hover:text-primary transition-colors">Members</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Featured</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-bold text-lg font-headline mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">My Profile</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Checkout</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Reservations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg font-headline mb-4">Follow Us</h3>
             <div className="flex justify-center md:justify-start space-x-4">
                <Link href="#" className="hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                 <Link href="#" className="hover:text-primary transition-colors">
                  <Star className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
