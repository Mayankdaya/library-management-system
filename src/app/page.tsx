"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function SpotlightPage() {
  return (
    <div className="h-screen w-full flex flex-col antialiased bg-transparent relative overflow-hidden">
      <Header />
      <div className="flex-grow flex items-center justify-center relative z-10">
        <div className="p-4 max-w-7xl mx-auto relative w-full text-center">
          <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 font-headline">
            Verdant Library
          </h1>
          <p className="mt-6 font-normal text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-body">
            A classic library management app to organize a collection of books and track their borrowing status. Reimagined with a modern, premium interface and intelligent features.
          </p>
          <div className="mt-10">
            <Link href="/catalog">
              <Button size="lg">
                Enter the Library
                <MoveRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Spotlight />
    </div>
  );
}
