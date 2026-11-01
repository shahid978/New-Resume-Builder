import { randomUUID } from "crypto";

/** Generate a request-scoped idempotency key for AI/charge operations. */
export function newIdempotencyKey(): string {
  return randomUUID();
}

/** Strip a leading "https://" or "http://" and any path/query for display. */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//i, "");
}

/** Validate that a URL is a safe, single external link (http/https only). */
export function isSafeExternalUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.protocol === "http:" || u.protocol === "https:") &&
      // Block loopback and private ranges to prevent SSRF.
      !["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(u.hostname) &&
      !u.hostname.startsWith("10.") &&
      !u.hostname.startsWith("192.168.") &&
      !/^172\.(1[6-9]|2\d|3[01])$/.test(u.hostname)
    );
  } catch {
    return false;
  }
}

/** Escape text for safe inclusion in HTML/PDF contexts. */
export function escapeText(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Truncate a string to a max length, preserving whole characters. */
export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return input.slice(0, max);
}

/** A tiny delay helper for retries. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}