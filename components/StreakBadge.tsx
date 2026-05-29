"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useStreak } from "@/lib/hooks/useStreak";

interface StreakBadgeProps {
  className?: string;
}

export default function StreakBadge({ className = "" }: StreakBadgeProps) {
  const { streak, isLoading } = useStreak();

  if (isLoading || streak.currentStreak < 1) return null;

  const getLevel = () => {
    if (streak.currentStreak >= 30) return { label: "Legendary", color: "text-purple-500" };
    if (streak.currentStreak >= 14) return { label: "Epic", color: "text-orange-500" };
    if (streak.currentStreak >= 7) return { label: "Hot", color: "text-red-500" };
    return { label: `${streak.currentStreak} day${streak.currentStreak > 1 ? 's' : ''}`, color: "text-[var(--text)]" };
  };

  const level = getLevel();

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Flame className={`w-4 h-4 ${level.color}`} />
      </motion.div>
      <span className="text-xs font-semibold">{level.label}</span>
    </motion.div>
  );
}