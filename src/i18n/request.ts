import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LOCALES } from "@/constants/locales";

export default getRequestConfig(async () => {
  const store = await cookies();
  let locale = store.get("locale")?.value || "en";
  if (!LOCALES.includes(locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../../i18n/${locale}.json`)).default,
  };
});
