import { BadRequest } from "@/lib/exceptions";
import { fetchFromGraphQL } from "./scrapers/graphql";
import { resolveRedirectUrl } from "@/utils";
import { getTranslations } from "next-intl/server";

export const getPostId = async (url: string, html?: string) => {
  const t = await getTranslations("errors");

  const postRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9._-]+\/)?p\/([a-zA-Z0-9_-]+)\/?/;
  const reelRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9._-]+\/)?(?:reel|reels)\/([a-zA-Z0-9_-]+)\/?/;
  const storyRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/stories\/([a-zA-Z0-9._-]+)\/?/;
  const highlightRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/stories\/highlights\/([0-9]+)\/?/;

  if (!url) {
    throw new BadRequest(t("invalid_url"), 400);
  }

  let postId: string | undefined;
  let type: "post" | "reel" | "story" | "highlight" | undefined;

  const postCheck = url.match(postRegex);
  const reelCheck = url.match(reelRegex);
  const highlightCheck = url.match(highlightRegex);
  const storyCheck = url.match(storyRegex);

  if (postCheck) {
    postId = postCheck.at(-1);
    type = "post";
  } else if (reelCheck) {
    postId = reelCheck.at(-1);
    type = "reel";
  } else if (highlightCheck) {
    postId = highlightCheck.at(-1);
    type = "highlight";
  } else if (storyCheck) {
    type = "story";
    const username = storyCheck[1]; // using index 1 is safer than at(-1)
    const match =
      html?.match(/"profile_id":"(\d+)"/) ||
      html?.match(/"user_id":"(\d+)"/) ||
      html?.match(/"id":"(\d+)"/);
    if (match && match[1]) {
      postId = match[1];
    } else {
      postId = username;
    }
  }

  if (!postId || !type) {
    throw new BadRequest(t("invalid_url"), 400);
  }

  return { id: postId, type };
};

export const fetchInstaContentJson = async (
  url: string,
  timeout: number = 0,
) => {
  const t = await getTranslations("errors");

  const { url: finalUrl, html: htmlData } = await resolveRedirectUrl({
    url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.8",
      Host: "www.instagram.com",
      referrer: "https://www.instagram.com/",
    },
  });

  const { id: postId, type } = await getPostId(finalUrl, htmlData);

  const apiJson = await fetchFromGraphQL(postId, finalUrl, timeout, type);
  if (apiJson) return apiJson;

  throw new BadRequest(t("private_or_not_exist"), 404);
};
