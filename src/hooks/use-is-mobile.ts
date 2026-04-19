"use client";

import { useEffect, useState } from "react";

const mobileMediaQuery = "(max-width: 1023px)";

function getInitialMatchState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(mobileMediaQuery).matches;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(getInitialMatchState);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mobileMediaQuery);

    const updateMatchState = () => {
      setIsMobile(mediaQueryList.matches);
    };

    updateMatchState();
    mediaQueryList.addEventListener("change", updateMatchState);

    return () => {
      mediaQueryList.removeEventListener("change", updateMatchState);
    };
  }, []);

  return isMobile;
}
