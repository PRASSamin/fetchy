import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { redis } from "@/lib/redis";

export async function DELETE(req: NextRequest) {
  const { keys } = await req.json();

  if (!keys || !Array.isArray(keys)) {
    return NextResponse.json(
      { error: "Missing or invalid keys" },
      { status: 400 }
    );
  }

  // batch delete
  const chunkSize = 20;
  const keyChunks = Array.from(
    { length: Math.ceil(keys.length / chunkSize) },
    (_, i) => keys.slice(i * chunkSize, (i + 1) * chunkSize)
  );

  try {
    for (const chunk of keyChunks) {
      await redis.del(...chunk);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete keys:", error);
    return NextResponse.json(
      { error: "Failed to delete keys" },
      { status: 500 }
    );
  }
}

function createStreamingResponse(stream: Readable) {
  return new Response(stream as any, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function PUT(req: NextRequest) {
  const { keys, data } = await req.json();

  if (!keys || !data) {
    return NextResponse.json(
      { error: "Missing keys or data" },
      { status: 400 }
    );
  }

  const keyArray = Array.isArray(keys) ? keys : [keys];
  const stream = new Readable({ read() {} });

  // Process updates in the background
  (async () => {
    try {
      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];
        const oldData: Record<string, any> = (await redis.get(key)) as Record<
          string,
          any
        >;

        await redis.set(key, { ...oldData, ...data });

        stream.push(
          `data: ${JSON.stringify({
            type: "progress",
            current: i + 1,
            total: keyArray.length,
            key,
            status: "updated",
          })}\n\n`
        );

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      stream.push(
        `data: ${JSON.stringify({
          type: "complete",
          message: `Successfully updated ${keyArray.length} items`,
        })}\n\n`
      );
    } catch (error: any) {
      stream.push(
        `data: ${JSON.stringify({
          type: "error",
          message: "Failed to update items",
          error: error.message,
        })}\n\n`
      );
    } finally {
      // End
      stream.push(null);
    }
  })();

  return createStreamingResponse(stream);
}
