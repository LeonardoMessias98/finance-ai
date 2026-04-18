"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if (!("serviceWorker" in navigator) || !window.isSecureContext) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/"
        });

        void registration.update().catch(() => undefined);
      } catch (error) {
        console.error("Failed to register service worker.", error);
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
}
