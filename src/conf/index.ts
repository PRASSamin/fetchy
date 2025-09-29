// Tiktok Configurations
export const ENABLE_TIKTOK = true;
// Instagram Configurations
export const ENABLE_INSTAGRAM = true;
// Facebook Configurations
export const ENABLE_FACEBOOK = true;
// Youtube Configurations
export const ENABLE_YOUTUBE = false;

// LOGGER
export const DOWNLOADER_SESSION_TTL = 120; // 2 minutes

export const SEND_TO_DISCORD = true; // TODO: Enable Discord Logger
export const ENABLE_LOGGER = true; // TODO: Enable Logger

export const LOGGER_CACHE_TTL = 60 * 10; // 10 minutes

// Redis
export const UPSTASH_URL = process.env.NEXT_UPSTASH_REDIS_REST_URL ?? "";
export const UPSTASH_TOKEN = process.env.NEXT_UPSTASH_REDIS_REST_TOKEN ?? "";

// env
export const FETCHY_API_KEY = process.env.NEXT_API_KEY!;
export const FETCHY_CDN_API_KEY = process.env.NEXT_CDN_API_KEY!;
export const STAGE = process.env.NEXT_STAGE!;
export const ADMIN_PANEL_PASSWORD = process.env.NEXT_ADMIN_PASSWORD!;

// Admin
export const ADMIN_AUTH_COOKIE_TTL = 60 * 60 * 24 * 30; // 30 days
