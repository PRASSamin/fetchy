import { LOCALES } from "@/constants";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365,
  },

  // Used when no locale matches
  defaultLocale: "en",
});
