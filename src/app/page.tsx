"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Spotlight } from '@/components/ui/spotlight';
import { cn } from '@/lib/utils';
import { CheckCircle, BookOpen, User, Star, MessageSquareQuote } from 'lucide-react';
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

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60 font-headline"
          >
            Verdant Library <br /> Your Gateway to Knowledge.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 font-normal text-base text-neutral-300 max-w-2xl mx-auto"
          >
            Explore a universe of stories, knowledge, and adventure. Your next chapter awaits in our extensive collection.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <Link href="/catalog">
              <Button size="lg" className="bg-primary/80 hover:bg-primary text-primary-foreground">
                Explore the Collection
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-24 max-w-7xl mx-auto relative z-10 w-full p-4"
        >
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
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-24 max-w-7xl mx-auto z-10 w-full p-4"
        >
          <section className="glassmorphic p-8 md:p-12">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">New Arrivals</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {newArrivals.map((book, index) => (
                  <CarouselItem key={book.id} className="md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-transparent border-none shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-0">
                        <motion.div
                          whileHover={{ y: -8, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          animate={{
                            y: [0, -5, 0],
                            transition: {
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                              delay: index * 0.2
                            }
                          }}
                        >
                          <Image 
                            src={bookCovers.bookCovers[index].src} 
                            alt={book.title} 
                            width={bookCovers.bookCovers[index].width}
                            height={bookCovers.bookCovers[index].height}
                            data-ai-hint={bookCovers.bookCovers[index].hint}
                            className="rounded-lg shadow-2xl h-64 w-auto object-cover" 
                          />
                        </motion.div>
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
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-24 max-w-7xl mx-auto z-10 w-full p-4"
        >
          <section className="glassmorphic p-8 md:p-12">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Popular Titles</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {popularTitles.map((book, index) => (
                  <CarouselItem key={book.id} className="md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-transparent border-none shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-0">
                         <motion.div
                          whileHover={{ y: -8, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          animate={{
                            y: [0, -5, 0],
                            transition: {
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                              delay: (index + 5) * 0.2
                            }
                          }}
                        >
                          <Image 
                            src={bookCovers.bookCovers[index + 5].src} 
                            alt={book.title}
                            width={bookCovers.bookCovers[index + 5].width}
                            height={bookCovers.bookCovers[index + 5].height}
                            data-ai-hint={bookCovers.bookCovers[index + 5].hint}
                            className="rounded-lg shadow-2xl h-64 w-auto object-cover" 
                          />
                        </motion.div>
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
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-24 max-w-5xl mx-auto z-10 w-full p-4"
        >
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
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-24 max-w-4xl mx-auto z-10 w-full p-4"
        >
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
        </motion.div>
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
              <li><Link href="#" className="text-sm hover:text-primary transition-colors">Community</Link></li>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 9.6 0 7.1-4.3 11.7-11.6 11.7-5.8 0-10-3.8-11.5-6.5C2.5 16.5 4.1 18 7.8 18c2.3 0 4.3-.8 6.1-2.1C11.1 16.2 9 13.5 8.1 11.5c.8.1 1.5.2 2.3.2 1.3 0 2.4-.3 3.3-.9C10.5 9.7 9 7.1 9 4.5 9.2 4.4 11.4 5.6 11.4 5.6S10 2.1 13.1 2.1c2.1 0 4.1 1.4 4.1 4.1 0 0 .5-1.7 2.8-2.1z"/></svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                 <Link href="#" className="hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span className="sr-only">Instagram</span>
                </Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
