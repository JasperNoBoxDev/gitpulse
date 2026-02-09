/**
 * Lightweight OAuth token exchange.
 *
 * - Vercel: uses /api/auth/callback serverless function (has client_secret)
 * - GitHub Pages: uses a tiny Cloudflare Worker proxy (deploy your own)
 * - Dev fallback: PAT token input
 *
 * The proxy URL is configured via VITE_OAUTH_PROXY_URL.
 * If not set, falls back to Vercel's /api/auth/callback.
 */

const PROXY_URL = import.meta.env.VITE_OAUTH_PROXY_URL as string | undefined;
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;

export function getAuthMode(): "oauth" | "pat" {
  return CLIENT_ID ? "oauth" : "pat";
}

export function getOAuthLoginUrl(): string {
  const redirectUri = PROXY_URL
    ? `${PROXY_URL}?redirect=${encodeURIComponent(window.location.origin)}`
    : `${window.location.origin}/api/auth/callback`;

  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent("repo read:org")}`;
}
