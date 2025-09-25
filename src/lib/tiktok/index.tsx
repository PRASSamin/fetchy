import { BadRequest } from "@/lib/exceptions";
import { fetchTiktokContent } from "./scrapers/api";
import { TiktokResponse } from "@/types/api/downloader";
import { getTranslations } from "next-intl/server";

export const fetchTiktokContentJson = async (
  url: string,
  timeout: number = 5000
) => {
  const t = await getTranslations("errors");
  const result: TiktokResponse | null = await fetchTiktokContent(url, timeout);
  if (result) {
    return result;
  }

  throw new BadRequest(t("private_or_not_exist"), 404);
};
