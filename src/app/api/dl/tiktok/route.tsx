import { NextRequest, NextResponse } from "next/server";
import { fetchTiktokContentJson } from "@/lib/tiktok";
import { SuccessResponse } from "@/utils";
import { postExec } from "../postExec";
import { handleError } from "../helper";
import { TokenManager } from "@/lib/security";
import { ipAddress, waitUntil } from "@vercel/functions";
import { redenv } from "@/lib/redenv";
import { Exception } from "@/lib/exceptions";

const manager = new TokenManager();

export async function POST(request: NextRequest) {
  let response;
  let isExpectedError = false;
  const env = await redenv.load();

  try {
    if (env.ENABLE_TIKTOK === "false") {
      isExpectedError = true;
      return NextResponse.json(
        { error: "Tiktok downloading server currently unavailable" },
        { status: 403 },
      );
    }

    const clonedRequest = request.clone();
    const body = await clonedRequest.json();
    const { url } = body;

    const session = request.cookies.get("d_session")?.value;
    const ip =
      (
        ipAddress(request) ||
        request.headers.get("x-forwarded-for")?.split(",")[0]
      )?.trim() || "";
    const userAgent = request.headers.get("user-agent") || "";

    if (!session || !manager.verifyToken({ token: session, ip, userAgent })) {
      isExpectedError = true;
      return NextResponse.json(
        { error: "Invalid API Credentials" },
        { status: 401 },
      );
    }

    const json = await fetchTiktokContentJson(url, 8000).catch((err) => {
      response = handleError(err);
      throw new Exception(response.body.error, response.status);
    });

    const data = SuccessResponse(json);
    response = { body: data, status: 200 };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    response = handleError(error);
    return NextResponse.json(response.body, { status: response.status });
  } finally {
    if (!isExpectedError) {
      // @ts-expect-error: response is a minimal object with {body, status} but postExec expects NextResponse
      waitUntil(postExec(request, response));
    }
  }
}
