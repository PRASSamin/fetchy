export const LOCALES_INFO = [
  {
    locale: "en", // English
    state: "stable",
    name: "English",
    country: "US", // Primary flag icon
    countries: ["US", "GB", "CA", "AU"],
  },
  {
    locale: "id", // Indonesian
    state: "beta",
    name: "Bahasa Indonesia",
    country: "ID",
    countries: ["ID"],
  },
  {
    locale: "ar", // Arabic (RTL)
    state: "beta",
    name: "العربية",
    country: "SA", // Saudi Arabia
    countries: ["SA", "EG", "AE", "JO"],
  },
  {
    locale: "pt-BR", // Portuguese (Brazil)
    state: "beta",
    name: "Português (Brasil)",
    country: "BR",
    countries: ["BR"],
  },
  {
    locale: "es", // Spanish
    state: "beta",
    name: "Español",
    country: "ES", // Spain
    countries: ["ES", "MX", "AR", "CO"],
  },
  {
    locale: "fr", // French
    state: "beta",
    name: "Français",
    country: "FR",
    countries: ["FR", "CA", "BE"],
  },
  {
    locale: "hi", // Hindi
    state: "beta",
    name: "हिन्दी",
    country: "IN",
    countries: ["IN"],
  },
  {
    locale: "ru", // Russian
    state: "beta",
    name: "Русский",
    country: "RU",
    countries: ["RU", "KZ", "BY"],
  },
  {
    locale: "bn", // Bengali
    state: "stable",
    name: "বাংলা",
    country: "BD", // Bangladesh
    countries: ["BD", "IN"],
  },
  {
    locale: "de", // German
    state: "beta",
    name: "Deutsch",
    country: "DE", // Germany
    countries: ["DE", "AT", "CH"],
  },
  {
    locale: "fa", // Persian (RTL)
    state: "beta",
    name: "فارسی",
    country: "IR", // Iran
    countries: ["IR", "AF"],
  },
  {
    locale: "ja", // Japanese
    state: "beta",
    name: "日本語",
    country: "JP",
    countries: ["JP"],
  },
];

export const LOCALES = LOCALES_INFO.map((locale) => locale.locale);