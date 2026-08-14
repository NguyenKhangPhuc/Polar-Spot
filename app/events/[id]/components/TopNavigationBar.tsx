"use client";

import React from "react";
import { motion } from "framer-motion";
import BackButton from "@/app/components/BackButton";

/**
 * PURPOSE:
 * Navigation bar component for single event view. Displays the BackButton component with Framer Motion entry transitions.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/events/[id]/SingleEventClient.tsx to isolate top navigation UI.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

export function TopNavigationBar() {
  /**
   * BEHAVIORAL MECHANISM:
   * Wraps top navigation layout in a motion.div container with fade-in and slide-down transition.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - JSX.Element: Top navigation bar element.
   */
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center justify-between"
    >
      <BackButton />
    </motion.div>
  );
}

export default TopNavigationBar;
