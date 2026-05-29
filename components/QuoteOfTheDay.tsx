"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";

interface QuoteOfTheDay {
  text: string;
  author: string;
  date: string;
}

const quotes: QuoteOfTheDay[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", date: "2026-05-28" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", date: "2026-05-29" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", date: "2026-05-30" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", date: "2026-05-31" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", date: "2026-06-01" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", date: "2026-06-02" },
  { text: "You learn more from failure than from success.", author: "Unknown", date: "2026-06-03" },
];

export default function QuoteOfTheDayCard() {
  const [quote, setQuote] = useState<QuoteOfTheDay | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("tts_quote_of_day");
    
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setQuote(parsed);
        return;
      }
    }

    // Get quote based on day of year (consistent for all users per day)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyQuote = quotes[dayOfYear % quotes.length];
    const quoteWithDate = { ...dailyQuote, date: today };
    
    setQuote(quoteWithDate);
    localStorage.setItem("tts_quote_of_day", JSON.stringify(quoteWithDate));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const today = new Date().toISOString().split("T")[0];
    const newQuote = { ...randomQuote, date: today };
    setQuote(newQuote);
    localStorage.setItem("tts_quote_of_day", JSON.stringify(newQuote));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!quote) return null;

  return (
    <motion.div
      className="border border-[var(--border)] rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Quote className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Quote of the Day</span>
        </div>
        
        <motion.blockquote
          key={quote.text}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl md:text-2xl font-serif font-medium mb-4 leading-relaxed"
        >
          "{quote.text}"
        </motion.blockquote>
        
        <div className="flex items-center justify-between">
          <cite className="text-sm text-[var(--text-muted)] not-italic">— {quote.author}</cite>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
            aria-label="New quote"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 0.6 }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}