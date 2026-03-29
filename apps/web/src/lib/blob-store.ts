import { put, list } from "@vercel/blob";

const NEWS_KEY = "data/news.json";
const TRENDS_KEY = "data/trends.json";
const METRICS_KEY = "data/metrics.json";

export async function readBlobJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const { blobs } = await list({ prefix: key, limit: 1 });
    if (blobs.length === 0) return fallback;
    const res = await fetch(blobs[0].url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function writeBlobJson(key: string, data: unknown): Promise<string> {
  const blob = await put(key, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function readNews(): Promise<any[]> {
  return readBlobJson(NEWS_KEY, []);
}

export async function writeNews(data: any[]): Promise<string> {
  return writeBlobJson(NEWS_KEY, data);
}

export async function readTrends(): Promise<any[]> {
  return readBlobJson(TRENDS_KEY, []);
}

export async function writeTrends(data: any[]): Promise<string> {
  return writeBlobJson(TRENDS_KEY, data);
}

export async function readMetrics(): Promise<any> {
  return readBlobJson(METRICS_KEY, {});
}

export async function writeMetrics(data: any): Promise<string> {
  return writeBlobJson(METRICS_KEY, data);
}
