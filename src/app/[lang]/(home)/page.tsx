import Home from "./view";
import { metatag } from "@/lib/metatag";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function HomePage() {
  return <Home />;
}

HomePage.displayName = "HomePage";

export async function generateMetadata() {
  const t = await getTranslations("metatags.root");
  const headersList = await headers();
  const url = new URL(headersList.get("x-current-url") ?? "");
  return metatag({
    title: t("title"),
    url: url.toString(),
  });
}