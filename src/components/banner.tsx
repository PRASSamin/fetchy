"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fluid } from "@/utils/fluid";

export default function Banner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("__BANNER_DISMISSED__");
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("__BANNER_DISMISSED__", "true");
  };

  if (!show) return null;

  return (
    <div
      style={{
        fontSize: fluid("0.875rem", "1rem") as string,
        lineHeight: fluid("1.25rem", "1.5rem") as string,
      }}
      className="w-full bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-100 px-4 py-4 flex items-center justify-between backdrop-blur-md shadow-md z-50"
    >
      <p>
        <span className="font-semibold text-emerald-400">Fetchy</span> has moved
        to&nbsp;
        <a
          href="https://gofetchy.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-300 hover:text-emerald-200 underline transition"
        >
          gofetchy.app
        </a>
        &nbsp; Don&apos;t forget to update your bookmarks!
      </p>
      <button
        onClick={dismiss}
        className="ml-4 text-emerald-300 hover:text-emerald-100 transition cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X
          style={{
            width: fluid("1rem", "1.25rem") as string,
            height: fluid("1rem", "1.25rem") as string,
          }}
        />
      </button>
    </div>
  );
}
