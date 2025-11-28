import { NextRequest, NextResponse } from "next/server";
import { TokenManager } from "@/lib/security";
import { DOWNLOADER_SESSION_TTL } from "@/conf";
import { redenv } from "@/lib/redenv";

export async function POST(request: NextRequest) {
  const manager = new TokenManager(DOWNLOADER_SESSION_TTL);
  const env = await redenv.load();
  const { key } = await request.json();
  if (!key || key !== env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = manager.createToken({
    ip: request.headers.get("x-user-ip") ?? "",
    userAgent: request.headers.get("x-user-agent") ?? "",
  });

  return NextResponse.json({ token });
}
