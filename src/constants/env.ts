export const REDENV_TOKEN_ID = (() => {
  const env = process.env.NEXT_REDENV_TOKEN_ID;
  if (!env) throw new Error("NEXT_REDENV_TOKEN_ID is not defined");
  return env;
})();
export const REDENV_TOKEN = (() => {
  const env = process.env.NEXT_REDENV_TOKEN;
  if (!env) throw new Error("NEXT_REDENV_TOKEN is not defined");
  return env;
})();
export const REDENV_UPSTASH_TOKEN = (() => {
  const env = process.env.NEXT_REDENV_UPSTASH_TOKEN;
  if (!env) throw new Error("NEXT_REDENV_UPSTASH_TOKEN is not defined");
  return env;
})();
export const REDENV_UPSTASH_URL = (() => {
  const env = process.env.NEXT_REDENV_UPSTASH_URL;
  if (!env) throw new Error("NEXT_REDENV_UPSTASH_URL is not defined");
  return env;
})();

export const UPSTASH_URL = (() => {
  const env = process.env.NEXT_UPSTASH_REDIS_REST_URL;
  if (!env) throw new Error("NEXT_UPSTASH_REDIS_REST_URL is not defined");
  return env;
})();
export const UPSTASH_TOKEN = (() => {
  const env = process.env.NEXT_UPSTASH_REDIS_REST_TOKEN;
  if (!env) throw new Error("NEXT_UPSTASH_REDIS_REST_TOKEN is not defined");
  return env;
})();

export const STAGE = process.env.NODE_ENV!;
