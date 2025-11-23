"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableTextProps {
  text: string;
  limit?: number; // Character limit before truncation
}

export default function ExpandableText({
  text,
  limit = 160,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > limit;
  const displayed = expanded
    ? text
    : text.slice(0, limit) + (isLong ? "..." : "");

  return (
    <div className="space-y-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={expanded ? "expanded" : "collapsed"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.01 }}
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {displayed}
        </motion.div>
      </AnimatePresence>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:cursor-pointer hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-0"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
