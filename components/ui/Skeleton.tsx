"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rect" | "card";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const baseStyles = "bg-[var(--border)] animate-pulse overflow-hidden";
  
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rect: "rounded-lg",
    card: "rounded-2xl",
  };

  const style = {
    width: width || "100%",
    height: height || (variant === "circular" ? undefined : "auto"),
    minHeight: variant !== "circular" ? `${variant === "text" ? "1rem" : "auto"}` : undefined,
  };

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Pre-built skeleton components
export function SkeletonCard() {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-4 space-y-3">
      <Skeleton variant="card" className="aspect-[16/9]" />
      <Skeleton variant="text" className="h-6 w-3/4" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

export function SkeletonPostCard() {
  return (
    <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
      <Skeleton variant="card" className="aspect-[16/9]" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-6 w-3/4" />
        <Skeleton variant="text" className="w-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonQuote() {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-8 space-y-4">
      <Skeleton variant="text" className="h-8 w-full" />
      <Skeleton variant="text" className="h-8 w-5/6" />
      <Skeleton variant="text" className="h-4 w-1/3 mt-4" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="h-6 w-32" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
      </div>
      <Skeleton variant="rect" className="h-32 w-full" />
    </div>
  );
}