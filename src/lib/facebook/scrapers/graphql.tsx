import querystring from "querystring";
import { formatGraphqlVideoJson, formatGraphqlStoryJson } from "./formatters";
import { HttpRequest } from "@/utils";
import { handleScraperError } from "./helpers";
import {
  FacebookContentType,
  FacebookVideoResponse,
} from "@/types/api/downloader";
import { FB_SEMI_PRIVATE_REEL_OR_VIDEO_FETCH_API } from "@/constants";
import axios from "axios";
import { FB_COOKIE, FB_DTSG_TOKEN, FETCHY_CDN_API_KEY } from "@/constants/env";
import { BadRequest } from "@/lib/exceptions";

const encodeVideoRequestData = (contentId: string) => {
  const requestData = {
    doc_id: 5279476072161634,
    variables: JSON.stringify({
      UFI2CommentsProvider_commentsKey: "CometTahoeSidePaneQuery",
      caller: "CHANNEL_VIEW_FROM_PAGE_TIMELINE",
      displayCommentsContextEnableComment: null,
      displayCommentsContextIsAdPreview: null,
      displayCommentsContextIsAggregatedShare: null,
      displayCommentsContextIsStorySet: null,
      displayCommentsFeedbackContext: null,
      feedbackSource: 41,
      feedLocation: "TAHOE",
      focusCommentID: null,
      privacySelectorRenderLocation: "COMET_STREAM",
      renderLocation: "video_channel",
      scale: 1,
      streamChainingSection: false,
      useDefaultActor: false,
      videoChainingContext: null,
      videoID: contentId,
    }),
    server_timestamps: true,
  };
  const encoded = querystring.stringify(requestData);
  return encoded;
};

const encodeStoryHighlightRequestData = (
  contentId: string,
  type: FacebookContentType
) => {
  const isHighlight = type === "highlight";

  const docId = isHighlight ? "32287746704205066" : "7202535426537683";
  const variables = isHighlight
    ? {
        blur: 10,
        bucketID: contentId,
        feedbackSource: 65,
        feedLocation: "COMET_MEDIA_VIEWER",
        focusCommentID: null,
        initialBucketID: contentId,
        initialLoad: true,
        isFbNotesIncluded: false,
        isStoriesArchive: false,
        scale: 1,
        shouldDeferLoad: false,
        shouldEnableArmadilloStoryReply: true,
        shouldEnableLiveInStories: true,
        __relay_internal__pv__StoriesShouldIncludeFbNotesrelayprovider: false,
        __relay_internal__pv__StoriesThreeDotsMenuEntryPoint_enable_entrypoint_qerelayprovider: false,
        __relay_internal__pv__StoriesThreeDotsMenuRelay3D_enable_relay3d_qerelayprovider: false,
        __relay_internal__pv__CometUFICommentAvatarStickerAnimatedImagerelayprovider: false,
        __relay_internal__pv__IsWorkUserrelayprovider: false,
        __relay_internal__pv__StoriesLWRVariantrelayprovider:
          "www_new_reactions",
      }
    : {
        bucketIDs: [contentId],
        scale: 1,
        blur: 10,
        shouldEnableArmadilloStoryReply: true,
        shouldEnableLiveInStories: true,
        feedbackSource: 65,
        useDefaultActor: false,
        feedLocation: "COMET_MEDIA_VIEWER",
        focusCommentID: null,
        shouldDeferLoad: false,
        isStoriesArchive: false,
        __relay_internal__pv__StoriesIsShareToStoryEnabledrelayprovider: false,
        __relay_internal__pv__IsWorkUserrelayprovider: false,
      };

  const requestData = {
    doc_id: docId,
    variables: JSON.stringify(variables),
    fb_dtsg: FB_DTSG_TOKEN,
    server_timestamps: true,
  };
  return querystring.stringify(requestData);
};

export const fetchFromFbGraphQL = async (
  type: FacebookContentType,
  contentId: string,
  requestedUrl: string,
  timeout: number = 0
) => {
  if (!contentId) return null;

  const API_URL = "https://www.facebook.com/api/graphql";
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    "accept-language": "en-US,en;q=0.8",
    accept: "*/*",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "x-asbd-id": "359341",
    "x-fb-friendly-name": "StoriesSuspenseContentPaneRootWithEntryPointQuery",
    "x-fb-lsd": "KLAEUjPxtGRiaMNx5zNUVg",
    origin: "https://www.facebook.com",
    cookie: FB_COOKIE,
  };

  const encodedData =
    type === "video"
      ? encodeVideoRequestData(contentId)
      : encodeStoryHighlightRequestData(contentId, type);

  let response;
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
  } catch (e: any) {
    handleScraperError(e);
    return null;
  }
  if (response.statusText === "error") return null;
  const contentType = response.headers["content-type"];
  if (contentType !== 'text/html; charset="utf-8"') return null;

  const responseJson = response.data;

  if (type === "video") {
    let json = formatGraphqlVideoJson(responseJson);
    // if formatedJson is null, thats mean it might be a private or semi-private video. so fetch it from the cdn
    if (json === null) {
      json = await fetchSemiPrivateVideo(requestedUrl);
    }

    // if it is still null, then throw error
    if (json === null)
      throw new BadRequest(
        "The requested post is either unavailable or has privacy restrictions."
      );

    return json;
  } else if (type === "story" || type === "highlight") {
    const formatedJson = formatGraphqlStoryJson(responseJson, contentId, type);

    if (!formatedJson?.owner || formatedJson?.stories?.length === 0)
      return null;
    return formatedJson;
  }
};

export const fetchSemiPrivateVideo = async (
  url: string,
  timeout: number = 5000
): Promise<FacebookVideoResponse | null> => {
  if (!url) return null;
  try {
    const api = new URL(FB_SEMI_PRIVATE_REEL_OR_VIDEO_FETCH_API);
    const response = await axios.get(
      `${FB_SEMI_PRIVATE_REEL_OR_VIDEO_FETCH_API}${url}`,
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
