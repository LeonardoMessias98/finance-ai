import { createPwaIconResponse } from "@/lib/pwa/create-pwa-icon-response";

export async function GET() {
  return createPwaIconResponse({
    size: 180
  });
}
