"use client";
import { Link as NextLink } from "@/i18n/navigation";
import NProgress from "nprogress";

import { addBasePath } from "next/dist/client/add-base-path";
import React from "react";
import { LOCALES } from "@/constants/locales";

function getURL(href: string) {
  return new URL(addBasePath(href), location.href);
}

// https://github.com/vercel/next.js/blob/400ccf7b1c802c94127d8d8e0d5e9bdf9aab270c/packages/next/src/client/link.tsx#L169
function isModifiedEvent(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  const eventTarget = event.currentTarget;
  const target = eventTarget?.getAttribute("target");
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
  href: string,
  clickEvent?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  const current = window.location;
  const target = getURL(href);
  if (clickEvent && isModifiedEvent(clickEvent)) return false; // modified events: fallback to browser behaviour
  if (current.origin !== target.origin) return false; // external URL
  // Strip any supported locale prefix from both current pathname (passed from hook)
  // and target pathname before comparing. This avoids false differences due to locale segment.
  const stripLocale = (path: string) => {
    for (const loc of LOCALES) {
      const prefix = `/${loc}`;
      if (path === prefix) return "/";
      if (path.startsWith(prefix + "/")) return path.slice(prefix.length) || "/";
    }
    return path;
  };
  const currentPath = stripLocale(current.pathname);
  const targetPath = stripLocale(target.pathname);
  if (
    currentPath === targetPath
  )
    return false; // same URL

  return true;
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NextLink>
>(({ onClick, href, ...props }, ref) => {
  const useLink = href && (href as string).startsWith("/");
  if (!useLink) return <a href={href as string} onClick={onClick} {...props} />;

  return (
    <NextLink
      href={href as any}
      onClick={(event) => {
        if (shouldTriggerStartEvent(href as string, event))
          NProgress.start();
        if (onClick) onClick(event);
      }}
      {...props}
      ref={ref}
    />
  );
});

Link.displayName = "Link";
