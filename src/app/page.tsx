"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import Header from "@/components/Header";

export default function SpotlightNewDemo() {
  return (
    <div className="h-screen w-full flex flex-col antialiased bg-transparent relative overflow-hidden">
      <Header />
      <div className="flex-grow flex md:items-center md:justify-center relative">
        <Spotlight />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Verdant Library
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            A classic library management app to organize a collection of books and track their borrowing status.
          </p>
        </div>
      </div>
    </div>
  );
}
