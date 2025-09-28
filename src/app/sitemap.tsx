import { MetadataRoute } from "next";
import { LOCALES } from "@/constants/locales";
import { tools } from "@/lib/tools/source";
import { FETCHY_BASE_URL } from "@/constants";
import { source } from "@/lib/source";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const getFullUrl = (locale: string, path: string) =>
  `${FETCHY_BASE_URL}${getPathname({ locale, href: path })}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = source.getPages();
  const toolList = tools.getTools();

  const basePages = [
    {
      path: "/",
      lastModified: new Date(),
    },
    ...toolList.map((tool) => ({
      path: tool.url.replace("/:lang", ""),
      lastModified: tool.updatedAt,
    })),
    ...blogs.map((blog) => ({
      path: blog.url,
      lastModified: blog.data.updatedAt,
    })),
  ];

  const i18nSitemap = basePages.flatMap((page) => {
    const alternateLinks = LOCALES.map((locale) => ({
      hreflang: locale,
      href: getFullUrl(locale, page.path),
    }));
    alternateLinks.push({
      hreflang: "x-default",
      href: getFullUrl(routing.defaultLocale, page.path),
    });

    return LOCALES.map((locale) => ({
      url: getFullUrl(locale, page.path),
      lastModified: page.lastModified,
      alternates: {
        languages: Object.fromEntries(
          alternateLinks.map((link) => [link.hreflang, link.href])
        ),
      },
    }));
  });

  return i18nSitemap;
}
