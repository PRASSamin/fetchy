import axios from "axios";
import type { NextResponse, NextRequest } from "next/server";
import { Discord } from "@/lib/discord";
import { ENABLE_LOGGER, SEND_TO_DISCORD } from "@/conf";
import { redenv } from "@/lib/redenv";

export const postExec = async (
  request: NextRequest,
  response: NextResponse
) => {
  if (ENABLE_LOGGER) {
    if (!request.nextUrl.pathname.startsWith("/api/dl")) return;
    const env = await redenv.load();
    const discord = new Discord(request, response);

    try {
      const payload = await discord.payload();
      if (env.DISCORD_WEBHOOK_URL && SEND_TO_DISCORD) {
        await axios.post(
          env.DISCORD_WEBHOOK_URL,
          { embeds: [payload] },
          { headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (err) {
      console.error("PostExec failed:", err);
    }
  }
};
