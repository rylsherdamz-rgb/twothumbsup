"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeIn, slideUp, scaleIn } from "@/lib/animations";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "fade" | "slide" | "scale";
}

export default function FadeIn({ children, delay = 0, className = "", variant = "fade" }: FadeInProps) {
  const variants = {
    fade: fadeIn,
    slide: slideUp,
    scale: scaleIn,
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants[variant]}
      transition={{ delay, duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}