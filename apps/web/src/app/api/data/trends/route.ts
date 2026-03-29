export const dynamic = "force-dynamic";

import { readTrends } from "@/lib/blob-store";
import staticTrends from "@/data/trends.json";

export async function GET() {
  try {
    const blobTrends = await readTrends();
    if (blobTrends.length > 0) {
      return Response.json(blobTrends);
    }
  } catch {}
  // Fallback to static data
  return Response.json(staticTrends);
}
