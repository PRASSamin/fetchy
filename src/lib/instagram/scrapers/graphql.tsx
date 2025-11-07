import querystring from "querystring";

import { HttpRequest } from "@/utils";
import { handleScraperError } from "./helpers";
import { formatGraphqlJson } from "./formatters";
import { IG_SEMI_PRIVATE_REEL_FETCH_API } from "@/constants";
import {
  InstagramResponse,
  InstagramContentType,
} from "@/types/api/downloader";
import axios from "axios";
import { FETCHY_CDN_API_KEY, IG_COOKIE } from "@/constants/env";
import { BadRequest } from "@/lib/exceptions";

const encodePostRequestData = (postId: string, type: InstagramContentType) => {
  const isPostOrReel = ["post", "reel"].includes(type);
  const docId = isPostOrReel ? "10015901848480474" : "31842794902034649";
  const variables = isPostOrReel
    ? {
        shortcode: postId,
        fetch_comment_count: "null",
        fetch_related_profile_media_count: "null",
        parent_comment_count: "null",
        child_comment_count: "null",
        fetch_like_count: "null",
        fetch_tagged_user_count: "null",
        fetch_preview_comment_count: "null",
        has_threaded_comments: "false",
        hoisted_comment_id: "null",
        hoisted_reply_id: "null",
      }
    : {
        initial_reel_id: `highlight:${postId}`,
        reel_ids: [`highlight:${postId}`],
        first: 1,
      };
  const requestData = {
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "3",
    __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
    dpr: "3",
    __ccg: "UNKNOWN",
    __rev: "1008824440",
    __s: "xf44ne:zhh75g:xr51e7",
    __hsi: "7282217488877343271",
    __dyn:
      "7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg",
    __csr:
      "gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUGWGh5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw",
    __comet_req: "7",
    lsd: "AVqbxe3J_YA",
    jazoest: "2957",
    __spin_r: "1008824440",
    __spin_b: "trunk",
    __spin_t: "1695523385",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables: JSON.stringify(variables),
    server_timestamps: "true",
    doc_id: docId,
  };
  const encoded = querystring.stringify(requestData);
  return encoded;
};

export const fetchFromGraphQL = async (
  postId: string,
  requestedUrl: string,
  timeout: number = 0,
  type: InstagramContentType
) => {
  if (!postId) return null;
  const isStoryOrHighlight = ["story", "highlight"].includes(type);

  const API_URL = isStoryOrHighlight
    ? "https://www.instagram.com/graphql/query"
    : "https://www.instagram.com/api/graphql";
  const headers = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
    "X-CSRFToken": "RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52",
    "X-IG-App-ID": "1217981644879628",
    "X-FB-LSD": "AVqbxe3J_YA",
    "X-ASBD-ID": "129477",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
    cookie: ["highlight", "story"].includes(type)
      ? `${IG_COOKIE}`
      : "",
  };

  const encodedData = encodePostRequestData(postId, type);

  let response: any;
  try {
    response = await HttpRequest({
      url: API_URL,
      method: "POST",
      headers,
      data: encodedData,
      timeout,
    });
    if (response.statusText === "error") {
      return null;
    }
  } catch (e) {
    handleScraperError(e as Error);
    return null;
  }

  if (response.statusText === "error") return null;

  const responseJson = response.data;
  if (!responseJson.data) return null;

  let json = formatGraphqlJson(responseJson, type);
  console.log(json);
  // if formatedJson is null, thats mean it might be a private or semi-private video. so fetch it from the cdn
  if (json === null) {
    json = await fetchIGSemiPrivateReel(requestedUrl, timeout);
  }

  // if it is still null, then throw error
  if (json === null) throw new BadRequest("This post does not exist");

  return json;
};

export const fetchIGSemiPrivateReel = async (
  url: string,
  timeout: number = 5000
): Promise<InstagramResponse | null> => {
  if (!url) return null;
  try {
    const api = new URL(IG_SEMI_PRIVATE_REEL_FETCH_API);
    const response = await axios.get(
      `${IG_SEMI_PRIVATE_REEL_FETCH_API}${url}`,
      {
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
      }
    );
    // it will return formated json so no need to format it again
    return response.data;
  } catch (e: any) {
    handleScraperError(e);
    return null;
  }
};
