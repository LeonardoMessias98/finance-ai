"use client";

import { useEffect } from "react";

const refreshIntervalInMilliseconds = 50 * 60 * 1000;

export function SessionKeepAlive() {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "same-origin"
      });
    }, refreshIntervalInMilliseconds);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
