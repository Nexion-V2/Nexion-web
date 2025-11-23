import React from "react";
import type { FC } from "react";

// --- Skeleton Component ---
export const SkeletonCard: FC = () => {
  return (
    <div className="flex items-center gap-3 p-4 border border-transparent rounded-lg bg-neutral-800/30 animate-pulse">
      <div className="w-10 h-10 bg-neutral-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-neutral-700 rounded"></div>
        <div className="h-3 w-3/4 bg-neutral-700 rounded"></div>
        <div className="h-3 w-1/3 bg-neutral-700 rounded"></div>
      </div>
    </div>
  );
}