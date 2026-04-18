import "server-only";

import { headers } from "next/headers";

export async function getRequestClientContext(): Promise<{
  ip: string;
  location?: string;
  userAgent: string;
}> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const userAgent = requestHeaders.get("user-agent")?.trim() || "unknown";
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "0.0.0.0";
  const city = requestHeaders.get("x-vercel-ip-city")?.trim();
  const region = requestHeaders.get("x-vercel-ip-country-region")?.trim();
  const country = requestHeaders.get("x-vercel-ip-country")?.trim();
  const locationParts = [city, region, country].filter((value): value is string => Boolean(value));

  return {
    ip,
    location: locationParts.length > 0 ? locationParts.join(", ") : undefined,
    userAgent
  };
}
