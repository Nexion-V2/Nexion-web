"use client";

import { useEffect, useState } from "react";

export function useRelativeTime(timestamp: string) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    if (!timestamp) return;

    function getRelativeTime() {
      const now = new Date();
      const past = new Date(timestamp);
      if (isNaN(past.getTime())) return "";

      const diffSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

      if (diffSeconds < 60) return "Just now";

      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

      if (diffSeconds < 3600)
        return rtf.format(-Math.floor(diffSeconds / 60), "minute");

      if (diffSeconds < 86400)
        return rtf.format(-Math.floor(diffSeconds / 3600), "hour");

      if (diffSeconds < 604800)
        return rtf.format(-Math.floor(diffSeconds / 86400), "day");

      return past.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    setRelativeTime(getRelativeTime());

    // Auto-update every 30 seconds
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime());
    }, 30000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return relativeTime;
}
