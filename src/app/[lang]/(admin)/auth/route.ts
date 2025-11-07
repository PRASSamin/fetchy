import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_AUTH_COOKIE } from "@/constants";
import {  ADMIN_PANEL_PASSWORD } from "@/constants/env";
import { ADMIN_AUTH_COOKIE_TTL, } from "@/conf";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password)
    return NextResponse.json(
      { success: false, message: "Password is required" },
      { status: 400 }
    );
  const cookieStore = await cookies();

  if (password === ADMIN_PANEL_PASSWORD) {
    cookieStore.set(ADMIN_AUTH_COOKIE, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ADMIN_AUTH_COOKIE_TTL,
      path: "/",
    });
    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Invalid password" },
    { status: 401 }
  );
}
