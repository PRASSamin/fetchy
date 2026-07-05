import { BadRequest } from "@/lib/exceptions";
import {
  getIGVideoFileName,
  getIGImageFileName,
  getIGAudioFileName,
  parseDashManifest,
} from "./helpers";
import { _generateRandomId } from "@/lib/facebook/scrapers/formatters";
import { DOMParser } from "xmldom";
import {
  InstagramContentType,
  InstagramResource,
  InstagramResponse,
  InstagramStoryResponse,
} from "@/types/api/downloader";

export const formatGraphqlJson = (json: any, type: InstagramContentType) => {
  if (type === "post" || type === "reel") {
    return postAndReelFormatter(json);
  }

  if (type === "highlight" || type === "story") return highlightFormatter(json);

  return postAndReelFormatter(json);
};

/**
 * @private
 */
const postAndReelFormatter = (json: any) => {
  const data = json.data.xdt_shortcode_media;

  if (!data) {
    return null;
  }

  const owner = data.owner;
  owner.profile_pic = owner.profile_pic_url;
  owner.name = owner.full_name;
  owner.profile_url = `https://www.instagram.com/${owner.username}/`;

  const keysToRemove = [
    "is_verified",
    "is_private",
    "blocked_by_viewer",
    "followed_by_viewer",
    "restricted_by_viewer",
    "followed_by_viewer",
    "has_blocked_viewer",
    "is_embeds_disabled",
    "is_unpublished",
    "requested_by_viewer",
    "pass_tiering_recommendation",
    "edge_owner_to_timeline_media",
    "edge_followed_by",
    "profile_pic_url",
    "full_name",
  ];

  keysToRemove.forEach((key) => {
    if (key in owner) delete owner[key];
  });

  if (!data.is_video) {
    const childrenEdges =
      data.edge_sidecar_to_children?.edges || [
        {
          node: {
            id: _generateRandomId(),
            width: data.display_resources.at(-1).config_width,
            height: data.display_resources.at(-1).config_height,
          },
        },
      ] ||
      [];

    const PostJson: InstagramResponse = {
      id: data.id,
      type: "post",
      owner: owner,
      thumbnail: data.thumbnail_src,
      resources: [
        ...childrenEdges.map((edge: any) => {
          const resource: InstagramResource = {
            id: edge.node.id,
            filename: edge.node.is_video
              ? getIGVideoFileName(edge.node.id)
              : getIGImageFileName(edge.node.id),
            type: edge.node.is_video ? "video" : "image",
            mime_type: edge.node.is_video ? "video/mp4" : "image/jpeg",
            has_audio: edge.node.is_video ? edge.node.has_audio : false,
            width: edge.node?.dimensions?.width || edge.node.width,
            height: edge.node?.dimensions?.height || edge.node.height,
            baseURL: edge.node.is_video
              ? edge.node.video_url
              : edge.node.display_url,
            thumbnail: edge.node.display_url,
          };

          if (edge.node.is_video) resource.quality = "720p";

          return resource;
        }),
      ],
    };
    return PostJson;
  }

  const filename = getIGVideoFileName(data.id);
  const videoUrl = data.video_url;
  const { width, height } = data.dimensions;
  const thumbnailUrl = data.thumbnail_src;

  if (!videoUrl || !thumbnailUrl) {
    return null;
  }

  const videoJson: InstagramResponse = {
    id: data.id,
    thumbnail: thumbnailUrl,
    owner: owner,
    type: "reel",
    resources: [
      {
        id: data.id,
        filename: filename,
        type: "video",
        mime_type: "video/mp4",
        quality: "720p",
        has_audio: true,
        width: width,
        height: height,
        baseURL: videoUrl,
        thumbnail: thumbnailUrl,
      },
    ],
  };

  if (data.dash_info?.video_dash_manifest) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      data.dash_info.video_dash_manifest,
      "application/xml"
    );
    const AdaptationSet = doc.getElementsByTagName("AdaptationSet");

    for (let i = 0; i < AdaptationSet.length; i++) {
      const adp = AdaptationSet[i];
      const rep = adp.getElementsByTagName("Representation");

      for (let j = 0; j < rep.length; j++) {
        const baseURL = rep[j].getElementsByTagName("BaseURL")[0]?.textContent;
        if (!baseURL) continue;

        const width = rep[j].getAttribute("width");
        const height = rep[j].getAttribute("height");
        const mimeType = rep[j].getAttribute("mimeType");
        const quality =
          rep[j].getAttribute("FBQualityLabel") ||
          rep[j].getAttribute("FBQualityClass") ||
          `${width}p`;
        const type = adp.getAttribute("contentType");

        if (type === "video") {
          videoJson.resources.push({
            id: `${rep[j].getAttribute("id")}`,
            mime_type: mimeType || "video/mp4",
            filename: getIGVideoFileName(rep[j].getAttribute("id") || ""),
            type: "video",
            quality: quality,
            has_audio: false,
            width: Number(width),
            height: Number(height),
            baseURL: baseURL,
            thumbnail: thumbnailUrl,
          });
        } else if (type === "audio") {
          videoJson.resources.push({
            id: `${rep[j].getAttribute("id")}`,
            mime_type: "audio/mp3",
            filename: getIGAudioFileName(rep[j].getAttribute("id") || ""),
            has_audio: true,
            type: "audio",
            bitrate: "128kbps",
            baseURL: baseURL,
          });
        }
      }
    }
  }

  return videoJson;
};

/**
 * @private
 */
const highlightFormatter = (json: any) => {
  const data =
    json?.data?.xdt_api__v1__feed__reels_media__connection?.edges?.[0]?.node;

  if (!data) {
    return null;
  }
  const owner = data?.user;
  owner.profile_pic = owner?.profile_pic_url;
  owner.name = owner?.full_name;
  owner.profile_url = `https://www.instagram.com/${owner?.username}/`;

  const keysToRemove = [
    "is_verified",
    "is_private",
    "blocked_by_viewer",
    "followed_by_viewer",
    "restricted_by_viewer",
    "followed_by_viewer",
    "has_blocked_viewer",
    "is_embeds_disabled",
    "is_unpublished",
    "requested_by_viewer",
    "pass_tiering_recommendation",
    "edge_owner_to_timeline_media",
    "edge_followed_by",
    "profile_pic_url",
    "full_name",
  ];

  keysToRemove.forEach((key) => {
    if (key in owner) delete owner[key];
  });

  const contentInfo: InstagramStoryResponse = {
    id: data.id,
    owner: owner,
    type: "story",
    stories: [],
  };

  data.items.forEach((item: any) => {
    const imageVersions = item?.image_versions2?.candidates;
    // Pick the best image candidate by largest area (width * height)
    const bestImageCandidate =
      Array.isArray(imageVersions) && imageVersions.length > 0
        ? imageVersions.reduce((best: any, cand: any) => {
            const bestArea = (best?.width ?? 0) * (best?.height ?? 0);
            const candArea = (cand?.width ?? 0) * (cand?.height ?? 0);
            return candArea > bestArea ? cand : best;
          }, imageVersions[0])
        : null;
    const bestImageUrl: string | null = bestImageCandidate?.url ?? null;

    const standardVideo = item?.video_versions?.[0]?.url;

    const resources: InstagramResource[] = [];

    if (bestImageUrl) {
      resources.push({
        id: _generateRandomId(),
        filename: getIGImageFileName(
          `${item?.id}_${bestImageCandidate?.width}x${bestImageCandidate?.height}`
        ),
        type: "image",
        mime_type: "image/jpg",
        has_audio: false,
        width: bestImageCandidate?.width,
        height: bestImageCandidate?.height,
        baseURL: bestImageUrl,
      });
    }

    if (standardVideo) {
      resources.push({
        id: _generateRandomId(),
        filename: getIGVideoFileName(
          `${item?.id}_${item?.original_width}x${item?.original_height}`
        ),
        type: "video",
        mime_type: "video/mp4",
        quality: `${item?.original_width}p`,
        has_audio: true,
        width: item?.original_width,
        height: item?.original_height,
        baseURL: standardVideo,
      });
    }

    resources.push(
      ...parseDashManifest({
        manifest: item?.video_dash_manifest,
        thumbnailUrl: bestImageUrl || "",
      })
    );

    contentInfo.stories.push({
      id: item.id,
      type: "video",
      resources,
      thumbnail: bestImageUrl || "",
    });
  });
  
  return contentInfo;
};
