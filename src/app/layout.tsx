import { cn } from "@/utils";
import "./globals.css";
import { Russo_One } from "next/font/google";
import "nprogress/nprogress.css";
import { Montserrat } from "next/font/google";
import { Manrope } from "next/font/google";
import { Rethink_Sans } from "next/font/google";
import { Suspense } from "react";
import { Progress } from "@/components/progress";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { GoogleAnalytics } from "@/lib/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { DirectionProvider } from "@/hooks/useDir";
import Banner from "@/components/banner";
import { redenv } from "@/lib/redenv";

const rethink = Rethink_Sans({
  weight: ["400", "800"],
  style: "normal",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
});

const russo = Russo_One({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const manrope = Manrope({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export async function generateMetadata() {
  const t = await getTranslations("metatags.root");
  const title = t("title");
  const description = t("description");
  return {
    icons: {
      icon: [
        { url: "/favicons/favicon-96x96.png", sizes: "96x96" },
        { url: "/favicons/favicon-192x192.png", sizes: "192x192" },
        { url: "/favicons/favicon-512x512.png", sizes: "512x512" },
        { url: "/favicons/favicon.svg" },
      ],
      shortcut: ["/favicons/favicon.svg"],
      apple: [
        {
          url: "/favicons/favicon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    manifest: "/favicons/site.webmanifest",
    publisher: "PRAS",
    creator: "PRAS",
    appleWebApp: {
      title: "Fetchy",
    },
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      creator: "@prassamin78",
    },
  };
}

export default async function DefaultRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";
  const env = await redenv.load();

  const toolsConfig = {
    facebook: env.ENABLE_FACEBOOK !== "false",
    tiktok: env.ENABLE_TIKTOK !== "false",
    instagram: env.ENABLE_INSTAGRAM !== "false",
    youtube: env.ENABLE_YOUTUBE !== "false",
  };

  return (
    <TooltipProvider>
      <html
        lang={locale}
        dir={locale === "ar" || locale === "fa" ? "rtl" : "ltr"}
        suppressHydrationWarning
        className="dark"
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.TOOLS_CONFIG = ${JSON.stringify(toolsConfig)};`,
            }}
          />
        </head>
        <body
          className={cn(
            `antialiased bg-background font-sans !overflow-x-hidden`,
          )}
        >
          <Suspense fallback={null}>
            <Progress />
          </Suspense>
          <Toaster />
          <DirectionProvider
            dir={locale === "ar" || locale === "fa" ? "rtl" : "ltr"}
          >
            <NextIntlClientProvider>
              <Banner />
              {children}
            </NextIntlClientProvider>
          </DirectionProvider>
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics />
        </body>
      </html>
    </TooltipProvider>
  );
}
