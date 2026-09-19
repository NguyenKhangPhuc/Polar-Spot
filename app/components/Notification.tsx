"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";

/**
 * PURPOSE:
 * Global notification toast component for displaying pop-up alerts.
 * Positioned fixed at the top-right corner with Cyber-Nordic Obsidian styling,
 * neon cyan accents, and Framer Motion slide-fade transitions.
 *
 * CONTEXT/PARENT FILE:
 * Mounted globally inside app/layout.tsx to render notification alerts across all pages.
 *
 * INPUTS / PARAMETERS:
 * None (consumes state directly from NotificationContext).
 */

export function Notification() {
  const { notification, setNotification } = useNotification();

  /**
   * BEHAVIORAL MECHANISM:
   * Evaluates notification.isOpen and notification.content. Renders Framer Motion animated
   * toast container at top-right fixed position. Auto-dismisses via context timer or manual close click.
   */
  const handleDismiss = () => {
    setNotification({ content: null, isOpen: false });
  };

  return (
    <AnimatePresence>
      {notification.isOpen && notification.content && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-6 right-6 z-[100] max-w-md w-full sm:w-auto min-w-[320px] select-none pointer-events-auto"
        >
          <div className="bg-[#1d1b1a] border border-[#00ffec]/30 shadow-2xl shadow-black/90 rounded-sm p-4 flex items-center justify-between gap-4 relative overflow-hidden backdrop-blur-md">
            {/* Left vertical neon cyan accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00ffec]" />

            {/* Left Icon Badge */}
            <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-sm bg-[#00ffec]/10 border border-[#00ffec]/20 text-[#00ffec]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Notification Text Content */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-2">
              <span className="font-mono text-[8px] font-bold text-[#83958d] uppercase tracking-widest leading-none">
                SYSTEM NOTIFICATION
              </span>
              <p className="font-mono text-xs text-[#e8e1df] leading-relaxed break-words select-text font-medium">
                {notification.content}
              </p>
            </div>

            {/* Close Dismiss Button */}
            <button
              type="button"
              onClick={handleDismiss}
              title="Dismiss Notification"
              className="flex shrink-0 items-center justify-center w-6 h-6 rounded-sm border border-white/5 hover:border-red-400/30 bg-white/[0.02] hover:bg-red-500/10 text-[#83958d] hover:text-red-400 transition-all cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
