import { NextRequest, NextResponse } from "next/server";
import { TokenManager } from "@/lib/security";
import {  FETCHY_API_KEY } from "@/constants/env";
import { DOWNLOADER_SESSION_TTL } from "@/conf";

export async function POST(request: NextRequest) {
  const manager = new TokenManager(
    FETCHY_API_KEY,
    DOWNLOADER_SESSION_TTL
  );
  const { key } = await request.json();
  if (!key || key !== FETCHY_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = manager.createToken({
    ip: request.headers.get("x-user-ip") ?? "",
    userAgent: request.headers.get("x-user-agent") ?? "",
  });

  return NextResponse.json({ token });
}
