import { Metadata, ResolvingMetadata } from "next";
import NotFoundView from "./notfound/view";
import { metatag } from "@/lib/metatag";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const NotFoundPage = () => {
  return <NotFoundView />;
};

NotFoundPage.displayName = "NotFoundPage";

export default NotFoundPage;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations("_404");
  return metatag({
    title: t("metatag.title"),
    url: null as unknown as string,
    robots: "noindex, nofollow",
  });
}
