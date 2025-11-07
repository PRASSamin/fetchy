import { UPSTASH_URL, UPSTASH_TOKEN } from "@/constants/env";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: UPSTASH_URL,
  token: UPSTASH_TOKEN,
});
