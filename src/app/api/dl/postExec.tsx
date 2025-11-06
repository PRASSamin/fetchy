import axios from "axios";
import type { NextResponse, NextRequest } from "next/server";
import { Discord } from "@/lib/discord";
import { ENABLE_LOGGER, SEND_TO_DISCORD, ANONYMOUS_SECRET } from "@/conf";

export const postExec = async (
  request: NextRequest,
  response: NextResponse
) => {
  const xDownloadUrl = request.headers.get("x-download-url");
  const anonymousParam = new URL(xDownloadUrl ?? "").searchParams.get("pras");

  if (ANONYMOUS_SECRET && anonymousParam === ANONYMOUS_SECRET) {
    return; // Skip logging
  }

  if (ENABLE_LOGGER) {
    if (!request.nextUrl.pathname.startsWith("/api/dl")) return;

    const discord = new Discord(request, response);

    try {
      const payload = await discord.payload();
      if (discord.WEBHOOK_URL && SEND_TO_DISCORD) {
        await axios.post(
          discord.WEBHOOK_URL,
          { embeds: [payload] },
          { headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (err) {
      console.error("PostExec failed:", err);
    }
  }
};
