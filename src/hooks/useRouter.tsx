"use client";

import { shouldTriggerStartEvent } from "@/components/link";
import { useRouter as useRouterImpl } from "@/i18n/navigation";
import NProgress from "nprogress";
import { useLocale } from "next-intl";

type NavigationOptions = {
  locale?: string;
  scroll?: boolean;
  force?: boolean;
};

export const useRouter = () => {
  const locale = useLocale();
  const router = useRouterImpl();

  const safeWrap = async (
    fn: () => Promise<void>,
    href?: string,
    options?: NavigationOptions
  ) => {
    if (!options?.force && href && !shouldTriggerStartEvent(locale)) return;
    NProgress.start();
    await fn();
  };

  return {
    push: (href: string, options?: NavigationOptions) =>
      safeWrap(
        async () => {
          router.push(href, options);
        },
        href,
        options
      ),
    replace: (href: string, options?: NavigationOptions) =>
      safeWrap(
        async () => {
          router.replace(href, options);
        },
        href,
        options
      ),
    refresh: () => safeWrap(async () => router.refresh()),
    back: () => safeWrap(async () => router.back()),
    forward: () => safeWrap(async () => router.forward()),
  };
};
