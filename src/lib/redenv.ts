import {
  REDENV_TOKEN,
  REDENV_TOKEN_ID,
  REDENV_UPSTASH_TOKEN,
  REDENV_UPSTASH_URL,
} from "@/constants/env";
import { Redenv } from "@redenv/client";

export const redenv = new Redenv({
  project: "fetchy",
  token: REDENV_TOKEN,
  tokenId: REDENV_TOKEN_ID,
  environment:
    process.env.NODE_ENV === "production" ? "production" : "development",
  upstash: {
    url: REDENV_UPSTASH_URL,
    token: REDENV_UPSTASH_TOKEN,
  },
  log: "low",
});
