import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { MERGEIT_API } from "@/constants";
import { redenv } from "@/lib/redenv";

export async function POST(request: NextRequest) {
  try {
    const env = await redenv.load();
    const { video, audio } = await request.json();

    if (!video || !audio) {
      return NextResponse.json(
        { error: "Missing video or audio file URL" },
        { status: 400 }
      );
    }

    const cdnResponse = await axios.post(
      MERGEIT_API,
      { video, audio },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": env.CDN_API_KEY,
        },
      }
    );

    const data = cdnResponse.data;

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Failed to combine video and audio: ", error);

    return NextResponse.json(
      { error: "Failed to combine video and audio" },
      { status: 500 }
    );
  }
}
