import FacebookDownloaderView from "./view";
import { metatag } from "@/lib/metatag";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function FacebookDownloaderPage() {
  return <FacebookDownloaderView />;
}

FacebookDownloaderPage.displayName = "FacebookDownloaderPage";

export async function generateMetadata() {
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-url") ?? "");
  const t = await getTranslations("metatags.tools");
  return metatag({
    title: t("title", { platform: "Facebook" }),
    url: url.toString(),
  });
}
