"use client";

import { useEffect, useState, useCallback } from "react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string | null;
  totalVisits: number;
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: null,
    totalVisits: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("tts_streak");
    if (saved) {
      try {
        setStreak(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse streak data");
      }
    }
    setIsLoading(false);
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastVisit = streak.lastVisit?.split("T")[0];

    let newStreak = { ...streak };

    if (lastVisit !== today) {
      // New visit
      newStreak.totalVisits += 1;

      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          newStreak.currentStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak.currentStreak = 1;
        }
      } else {
        // First visit
        newStreak.currentStreak = 1;
      }

      newStreak.longestStreak = Math.max(newStreak.longestStreak, newStreak.currentStreak);
      newStreak.lastVisit = new Date().toISOString();

      setStreak(newStreak);
      localStorage.setItem("tts_streak", JSON.stringify(newStreak));
    }
  }, [streak]);

  return {
    streak,
    isLoading,
    updateStreak,
    isOnStreak: streak.currentStreak >= 3,
    isNewVisitor: streak.totalVisits <= 1,
  };
}