// Redis
export const UPSTASH_URL = process.env.NEXT_UPSTASH_REDIS_REST_URL ?? "";
export const UPSTASH_TOKEN = process.env.NEXT_UPSTASH_REDIS_REST_TOKEN ?? "";


export const FETCHY_API_KEY = process.env.NEXT_API_KEY!;
export const FETCHY_CDN_API_KEY = process.env.NEXT_CDN_API_KEY!;

export const STAGE = process.env.NEXT_STAGE!;

export const ADMIN_PANEL_PASSWORD = process.env.NEXT_ADMIN_PASSWORD!;
export const ANONYMOUS_SECRET = process.env.NEXT_ANONYMOUS_SECRET!;

export const IG_COOKIE = process.env.NEXT_IG_COOKIE!;
export const FB_COOKIE = process.env.NEXT_FB_COOKIE!;