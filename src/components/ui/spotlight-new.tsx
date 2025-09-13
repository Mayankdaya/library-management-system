"use client";
import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({
  className,
  fill,
}: SpotlightProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  let maskImage = useTransform(
    [mouseX, mouseY],
    ([newX, newY]) =>
      `radial-gradient(500px at ${newX}px ${newY}px, white, transparent)`
  );

  let style = {
    maskImage: maskImage,
    WebkitMaskImage: maskImage,
  };

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    let newX = clientX - left;
    let newY = clientY - top;

    mouseX.set(newX);
    mouseY.set(newY);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "absolute inset-0 h-screen w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-transparent",
        className
      )}
    >
      <motion.div
        className="absolute inset-[-20%] h-[140%] w-[140%] bg-transparent"
        style={style}
      />
       {fill && (
        <motion.div
          className="absolute inset-0 h-full w-full bg-transparent"
          style={{
            maskImage: `radial-gradient(500px at 50% 50%, ${fill}, transparent)`,
            WebkitMaskImage: `radial-gradient(500px at 50% 50%, ${fill}, transparent)`,
          }}
        />
      )}
    </div>
  );
};
