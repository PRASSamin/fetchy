import { defineRouting } from "next-intl/routing";

export const locales = [
  "en", // English
  "id", // Indonesian
  "ar", // Arabic
  "pt-BR", // Portuguese (Brazil)
  "es", // Spanish
  "fr", // French
  "hi", // Hindi
  "ru", // Russian
  "bn", // Bengali
  "de", // German
  "fa", // Persian
  "ja", // Japanese
];

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  localeCookie: {
    name: "locale",
    maxAge: 60 * 60 * 24 * 365,
  },

  // Used when no locale matches
  defaultLocale: "en",
});
