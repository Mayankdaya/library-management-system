"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Spotlight } from '@/components/ui/spotlight';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export default function PremiumHomePage() {
  const features = [
    { text: "Discover New Releases: Browse our latest arrivals and trending titles across genres." },
    { text: "Personalized Recommendations: Get tailored book suggestions based on your reading preferences." },
    { text: "Join Our Community: Participate in book clubs, author events, and reading challenges." },
    { text: "Digital & Physical Collections: Access eBooks, audiobooks, and print editions—all in one place." },
    { text: "24/7 Online Access: Enjoy seamless reading anytime, anywhere with our digital library." },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-body">
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

        <div className="mt-16 max-w-4xl mx-auto relative z-10 w-full p-4">
            <div className="glassmorphic p-8">
                <ul className="space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary/80 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-left">{feature.text}</span>
                    </li>
                ))}
                </ul>
                <p className="mt-8 text-center font-semibold text-lg text-primary/90">
                    Start your journey today—unlock endless possibilities with Verdant Library.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
