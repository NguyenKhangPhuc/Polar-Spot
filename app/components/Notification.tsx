"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";

/**
 * PURPOSE:
 * Global notification toast component for displaying pop-up alerts. Positioned fixed at the top-right
 * corner with Framer Motion slide and fade enter/exit animations. Consumes NotificationContext.
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
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - JSX.Element: Rendered AnimatePresence toast container.
   */
  const handleDismiss = () => {
    setNotification({ content: null, isOpen: false });
  };

  return (
    <AnimatePresence>
      {notification.isOpen && notification.content && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-6 right-6 z-50 flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-[#13243b]/95 border border-cyan-500/40 text-slate-100 shadow-2xl shadow-black/80 backdrop-blur-md max-w-md w-full sm:w-auto min-w-[300px]"
        >
          {/* Notification Indicator Dot & Text Content */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] shrink-0" />
            <p className="text-sm font-semibold text-white leading-snug truncate">
              {notification.content}
            </p>
          </div>

          {/* Close Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            title="Dismiss Notification"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
