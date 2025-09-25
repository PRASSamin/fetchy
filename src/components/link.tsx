"use client";
import { Link as NextLink } from "@/i18n/navigation";
import NProgress from "nprogress";

import { addBasePath } from "next/dist/client/add-base-path";
import React from "react";
import { useLocale } from "next-intl";

function getURL(href: string) {
  return new URL(addBasePath(href), location.href);
}

// https://github.com/vercel/next.js/blob/400ccf7b1c802c94127d8d8e0d5e9bdf9aab270c/packages/next/src/client/link.tsx#L169
function isModifiedEvent(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  const eventTarget = event.currentTarget;
  const target = eventTarget.getAttribute("target");
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.button === 1)
  );
}

export function shouldTriggerStartEvent(
  locale: string,
  href: string,
  clickEvent?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  const current = window.location;
  const target = getURL(href);
  if (clickEvent && isModifiedEvent(clickEvent)) return false; // modified events: fallback to browser behaviour
  if (current.origin !== target.origin) return false; // external URL
  if (
    current.pathname.replace(`/${locale}`, "") ===
      target.pathname.replace(`/${locale}`, "") &&
    current.search.replace(`/${locale}`, "") ===
      target.search.replace(`/${locale}`, "")
  )
    return false; // same URL

  return true;
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NextLink>
>(({ onClick, href, ...props }, ref) => {
  const useLink = href && (href as string).startsWith("/");
  const locale = useLocale();
  if (!useLink) return <a href={href as string} onClick={onClick} {...props} />;

  return (
    <NextLink
      href={href as any}
      onClick={(event) => {
        if (shouldTriggerStartEvent(locale, href as string, event))
          NProgress.start();
        if (onClick) onClick(event);
      }}
      {...props}
      ref={ref}
    />
  );
});

Link.displayName = "Link";
