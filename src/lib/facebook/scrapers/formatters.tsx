import { BadRequest } from "@/lib/exceptions";
import { getFbContentFileName, parseDashManifest } from "./helpers";
import {
  FacebookResource,
  FacebookStoryResponse,
  FacebookVideoResponse,
} from "@/types/api/downloader";

const keysToRemoveFromOwner = [
  "__isCameraPostBucketOwnerUnion",
  "__isNode",
  "story_bucket",
  "is_viewer_friend",
  "is_additional_profile_plus",
  "work_info",
  "work_foreign_entity_info",
  "__isActor",
  "__isEntity",
  "url",
  "short_name",
  "delegate_page",
  "is_verified",
  "gender",
  "profilePicture",
  "__typename",
  "profile_picture",
];

export const formatGraphqlVideoJson = (data: string) => {
  if (!data || !data?.split) {
    return null;
  }

  const response = data?.split("\n");
  const d1 = JSON.parse(response[0]);
  const d2 = response.filter(
    (i) =>
      JSON.parse(i).label ===
      "CometTahoeRootQuery$defer$CometTahoeSidepaneRenderer_video"
  );

  const responseData = [d1, JSON.parse(d2[0])];

  const isLive = responseData[0].data?.video?.is_live_streaming;

  const videoUrls = parseDashManifest({
    dashManifest: responseData[0].data?.video?.dash_manifest,
    thumbnail: responseData[0].data?.video?.preferred_thumbnail?.image?.uri,
    isLive,
  });

  const owner =
    responseData.at(-1)?.data?.tahoe_sidepane_renderer?.video?.creation_story
      ?.comet_sections?.actor_photo?.story?.actors?.[0] || {};

  owner.profile_pic =
    responseData.at(-1)?.data?.tahoe_sidepane_renderer?.video?.owner
      ?.owner_as_page?.profile_pic_uri ||
    owner?.profile_picture?.uri ||
    null;

  // remove unwanted keys from owner
  keysToRemoveFromOwner.forEach((key) => {
    if (key in owner) delete owner[key];
  });

  const videoData = responseData.at(0)?.data?.video || {};
  const sidePaneData =
    responseData.at(-1)?.data?.tahoe_sidepane_renderer?.video?.creation_story
      ?.comet_sections || {};

  const contentInfo: FacebookVideoResponse = {
    id: videoData.id || null,
    owner: Object.keys(owner).length ? owner : null,
    type: isLive ? "live" : "video",
    title: sidePaneData?.message?.story?.message?.text || null,
    thumbnail: videoData?.preferred_thumbnail?.image?.uri || null,
    resources: [
      {
        id: _generateRandomId(),
        filename: getFbContentFileName("VID", "SD", "mp4"),
        type: "video",
        mime_type: "video/mp4",
        quality: "SD",
        has_audio: true,
        baseURL: videoData.playable_url || null,
        thumbnail: videoData?.preferred_thumbnail?.image?.uri || null,
      },
      {
        id: _generateRandomId(),
        filename: getFbContentFileName("VID", "HD", "mp4"),
        type: "video",
        mime_type: "video/mp4",
        quality: "HD",
        has_audio: true,
        baseURL: videoData.playable_url_quality_hd || null,
        thumbnail: videoData?.preferred_thumbnail?.image?.uri || null,
      },
      ...videoUrls,
    ],
  };

  return contentInfo;
};

export function _generateRandomId() {
  return Math.random().toString(10).substring(2, 15);
}

export const formatGraphqlStoryJson = (
  raw: string,
  contentId: string,
  type: "story" | "highlight"
) => {
  if (!raw) {
    throw new BadRequest("This post does not exist");
  }

  let responseData;
  try {
    responseData = JSON.parse(raw.split("\n")[0]);
  } catch (e) {
    responseData = raw;
  }

  const _BUCKET_NAME = type === "story" ? "nodes" : "bucket";
  const _UNIFIED_STORIES_NAME =
    type === "story" ? "unified_stories" : "unified_stories_with_notes";

  const data = responseData?.data?.[_BUCKET_NAME];

  const owner = data?.[0]?.story_bucket_owner || data?.story_bucket_owner || {};
  owner.profile_pic = owner?.profilePicture?.uri || null;
  owner.profile_url = owner?.url || null;

  keysToRemoveFromOwner.forEach((key) => {
    if (key in owner) delete owner[key];
  });

  const contentInfo: FacebookStoryResponse = {
    id: contentId,
    owner: data?.[0]?.story_bucket_owner || data?.story_bucket_owner || null,
    type: "story",
    stories: [],
  };

  const edges =
    data?.[0]?.[_UNIFIED_STORIES_NAME]?.edges ||
    data?.[_UNIFIED_STORIES_NAME]?.edges ||
    [];

  if (Array.isArray(edges) && edges.length > 0) {
    edges.forEach((item, index) => {
      const media = item?.node?.attachments?.[0]?.media;
      if (index === 0) {
        contentInfo.thumbnail =
          item?.node?.story_card_info?.story_thumbnail?.uri || null;
      }
      if (media) {
        const resources: FacebookResource[] = [
          {
            id: _generateRandomId(),
            filename: getFbContentFileName(
              "IMG",
              `${media?.image?.width}x${media?.image?.height}`,
              "jpg"
            ),
            type: "image",
            mime_type: "image/jpg",
            has_audio: false,
            width: media?.image?.width,
            height: media?.image?.height,
            baseURL: media?.image?.uri || media?.previewImage?.uri,
          },
        ];

        if (media?.videoDeliveryLegacyFields?.browser_native_sd_url) {
          resources.push({
            id: _generateRandomId(),
            filename: getFbContentFileName("VID", "SD", "mp4"),
            type: "video",
            mime_type: "video/mp4",
            quality: "SD",
            has_audio: true,
            baseURL: media?.videoDeliveryLegacyFields?.browser_native_sd_url,
          });
        }

        if (media?.videoDeliveryLegacyFields?.browser_native_hd_url) {
          resources.push({
            id: _generateRandomId(),
            filename: getFbContentFileName("VID", "HD", "mp4"),
            type: "video",
            mime_type: "video/mp4",
            quality: "HD",
            has_audio: true,
            baseURL: media?.videoDeliveryLegacyFields?.browser_native_hd_url,
          });
        }

        resources.push(
          ...parseDashManifest({
            dashManifest:
              media?.videoDeliveryLegacyFields?.dash_manifest_xml_string,
          })
        );

        contentInfo.stories.push({
          id: media.id,
          type:
            media.__typename.toLowerCase() === "photo"
              ? "image"
              : media.__typename.toLowerCase(),
          resources,
          thumbnail: item?.node?.story_card_info?.story_thumbnail?.uri,
        });
      }
    });
  }

  return contentInfo;
};
