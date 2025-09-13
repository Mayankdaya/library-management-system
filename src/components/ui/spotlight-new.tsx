"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({
  className,
  fill,
}: SpotlightProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-screen w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-transparent",
        className
      )}
    >
      <motion.div
        className="absolute inset-[-20%] h-[140%] w-[140%] bg-transparent"
      />
       {fill && (
        <motion.div
          className="absolute inset-0 h-full w-full bg-transparent"
        />
      )}
    </div>
  );
};

    