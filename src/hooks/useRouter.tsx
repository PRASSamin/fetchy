"use client";

import { shouldTriggerStartEvent } from "@/components/link";
import { useRouter as useRouterImpl } from "@/i18n/navigation";
import NProgress from "nprogress";
import { useLocale } from "next-intl";

export const useRouter = () => {
  const locale = useLocale();
  const router = useRouterImpl();

  const safeWrap = async (fn: () => Promise<void>, href?: string) => {
    if (href && !shouldTriggerStartEvent(locale, href)) return;
    NProgress.start();
    await fn();
  };

  return {
    push: (href: string) =>
      safeWrap(async () => {
        router.push(href);
      }, href),
    replace: (href: string) =>
      safeWrap(async () => {
        router.replace(href);
      }, href),
    refresh: () => safeWrap(async () => router.refresh()),
    back: () => safeWrap(async () => router.back()),
    forward: () => safeWrap(async () => router.forward()),
  };
};
