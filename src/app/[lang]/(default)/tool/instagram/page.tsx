import InstagramDownloaderView from "./view";
import { metatag } from "@/lib/metatag";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function InstagramDownloaderPage() {
  return <InstagramDownloaderView />;
}

InstagramDownloaderPage.displayName = "InstagramDownloaderPage";

export async function generateMetadata() {
  const headersList = await headers();
  console.log(headersList.get("x-current-url"));
  const url = new URL(headersList.get("x-current-url") || "").toString();
  const t = await getTranslations("metatags.tools");
  return metatag({
    title: t("title", { platform: "Instagram" }),
    url,
  });
}
