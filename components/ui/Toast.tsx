"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "action";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
  duration?: number;
}

export default function Toast({ id, message, type, onDismiss, duration = 5000 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onDismiss(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onDismiss]);

  const bgColors = {
    success: "bg-[var(--text)] text-[var(--bg)]",
    error: "bg-red-500 text-white",
    info: "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]",
    action: "bg-[var(--text)] text-[var(--bg)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg ${bgColors[type]} max-w-md`}
    >
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(id), 300);
        }}
        className="p-1 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}