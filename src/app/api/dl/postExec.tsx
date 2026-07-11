import axios from "axios";
import type { NextResponse, NextRequest } from "next/server";
import { Discord } from "@/lib/discord";
import { redenv } from "@/lib/redenv";

export const postExec = async (
  request: NextRequest,
  response: NextResponse,
) => {
  const env = await redenv.load();

  // Check for silent mode
  const silentToken = request.headers.get("x-keep-silent");
  if (silentToken && env.SILENT_SECRET_TOKEN && silentToken === env.SILENT_SECRET_TOKEN) {
    return;
  }

  if (env.ENABLE_LOGGER === "true") {
    if (!request.nextUrl.pathname.startsWith("/api/dl")) return;
    const discord = new Discord(request, response);

    try {
      const payload = await discord.payload();
      if (env.DISCORD_WEBHOOK_URL && env.SEND_TO_DISCORD === "true") {
        await axios.post(
          env.DISCORD_WEBHOOK_URL,
          { embeds: [payload] },
          { headers: { "Content-Type": "application/json" } },
        );
      }
    } catch (err) {
      console.error("PostExec failed:", err);
    }
  }
};
