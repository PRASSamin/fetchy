import { handleScraperError } from "@/lib/facebook/scrapers/helpers";
import { TIKTOK_CONTENT_FETCH_API } from "@/constants";
import axios from "axios";
import { formatTiktokJson } from "./formatters";
import { TiktokResponse } from "@/types/api/downloader";
import { FETCHY_CDN_API_KEY } from "@/constants/env";

export const fetchTiktokContent = async (
  url: string,
  timeout: number = 5000
): Promise<TiktokResponse | null> => {
  if (!url) return null;
  try {
    const api = new URL(TIKTOK_CONTENT_FETCH_API);
    const response = await axios.get(`${TIKTOK_CONTENT_FETCH_API}${url}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Origin: api.origin,
        Referer: api.origin,
        Accept: "*/*",
        "X-API-KEY": FETCHY_CDN_API_KEY,
        Host: api.host,
      },
      timeout,
    });
    return formatTiktokJson(response.data);
  } catch (e: any) {
    handleScraperError(e);
    return null;
  }
};
