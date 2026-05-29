"use client";

import { motion } from "framer-motion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

export default function ReadingProgress() {
  const progress = useScrollProgress();

  if (progress === 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[var(--border)] z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full bg-[var(--text)]"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
}