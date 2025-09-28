"use client";

import { LOCALES_INFO } from "@/constants/locales";
import { useLocale } from "next-intl";
import { Banner as FumaBanner } from "fumadocs-ui/components/banner";

export default function Banner() {
  const locale = useLocale();
  let bannerContent = null;

  const MESSAGE = `${LOCALES_INFO.find((l) => l.locale === locale)?.name} is translated by Gemini AI and may not be 100% accurate.`;

  if (
    LOCALES_INFO.find((l) => l.locale === locale)?.state === "beta" &&
    MESSAGE
  ) {
    bannerContent = <>{MESSAGE}</>;
  }

  if (!bannerContent) return null;

  return (
    <FumaBanner
      variant="rainbow"
      rainbowColors={[
        "#f97316",
        "rgba(249, 115, 22, 0.7)",
        "transparent",
        "#f97316",
        "transparent",
        "rgba(249, 115, 22, 0.7)",
        "transparent",
      ]}
      changeLayout={false}
      id="banner"
      className="text-[15px] font-bold text-orange-200 relative"
    >
      {bannerContent}
    </FumaBanner>
  );
}
