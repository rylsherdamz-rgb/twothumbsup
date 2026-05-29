"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useEngagementStore } from "@/lib/store";
import { ThumbsUp } from "lucide-react";

export default function WelcomeToast() {
  const { showSuccess, showInfo } = useToast();
  const totalVisits = useEngagementStore((state) => state.totalVisits);
  const visitStreak = useEngagementStore((state) => state.visitStreak);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("tts_welcome_seen");
    
    if (hasSeenWelcome) return;

    const timer = setTimeout(() => {
      if (totalVisits === 1) {
        showSuccess("Welcome to Two Thumbs Up! 👋");
        showInfo("Pause, ponder, and be a source of joy.");
      } else if (visitStreak >= 7) {
        showSuccess(`🔥 ${visitStreak} day streak! You're on fire!`);
      } else if (visitStreak > 1) {
        showInfo(`Welcome back! ${visitStreak} day streak 🔥`);
      }
      
      sessionStorage.setItem("tts_welcome_seen", "true");
    }, 1500);

    return () => clearTimeout(timer);
  }, [totalVisits, visitStreak, showSuccess, showInfo]);

  return null;
}