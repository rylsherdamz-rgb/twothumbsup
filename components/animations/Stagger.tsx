"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { stagger, listItem } from "@/lib/animations";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  itemDelay?: number;
}

export default function Stagger({ children, className = "", delay = 0, itemDelay = 0.05 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: itemDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div variants={listItem} className={className}>
      {children}
    </motion.div>
  );
}