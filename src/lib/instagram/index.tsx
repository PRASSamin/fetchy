import { BadRequest } from "@/lib/exceptions";
import { fetchFromGraphQL } from "./scrapers/graphql";
import { resolveRedirectUrl } from "@/utils";
import { getTranslations } from "next-intl/server";

export const getPostId = async (url: string) => {
  const t = await getTranslations("errors");

  const postRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
  const reelRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/(?:reels|reel)\/([a-zA-Z0-9_-]+)\/?/;
  const storyRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/stories\/([a-zA-Z0-9._-]+)\/?$/;
  const highlightRegex =
    /^https:\/\/(?:www\.)?instagram\.com\/stories\/highlights\/([0-9]+)\/?$/;

  if (!url) {
    throw new BadRequest(t("invalid_url"), 400);
  }

  let postId: string | undefined;
  let type: "post" | "reel" | "story" | "highlight" | undefined;

  const postCheck = url.match(postRegex);
  if (postCheck) {
    postId = postCheck.at(-1);
    type = "post";
  }

  const reelCheck = url.match(reelRegex);
  if (reelCheck) {
    postId = reelCheck.at(-1);
    type = "reel";
  }

  const highlightCheck = url.match(highlightRegex);
  if (highlightCheck) {
    postId = highlightCheck.at(-1);
    type = "highlight";
  }

  const storyCheck = url.match(storyRegex);
  if (storyCheck) {
    postId = storyCheck.at(-1);
    type = "story";
  }

  if (!postId || !type) {
    throw new BadRequest(t("invalid_url"), 400);
  }

  return { id: postId, type };
};

export const fetchInstaContentJson = async (
  url: string,
  timeout: number = 0
) => {
  const t = await getTranslations("errors");

  const orgUrl = await resolveRedirectUrl({
    url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.8",
      Host: "www.instagram.com",
      referrer: "https://www.instagram.com/",
    },
  });

  const { id: postId, type } = await getPostId(orgUrl.url);

  const apiJson = await fetchFromGraphQL(postId, orgUrl.url, timeout, type);
  if (apiJson) return apiJson;

  throw new BadRequest(t("private_or_not_exist"), 404);
};
