"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Spotlight } from '@/components/ui/spotlight';
import { cn } from '@/lib/utils';

export default function PremiumHomePage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-body">
      <Header />
      <main className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-transparent antialiased relative overflow-hidden">
        <div
            className={cn(
            "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
            )}
        />
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="hsl(var(--primary))"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 font-headline">
            Verdant Library <br /> Your Gateway to Knowledge.
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
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
      </main>
    </div>
  );
}
