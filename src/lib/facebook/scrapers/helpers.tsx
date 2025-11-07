import { APP_NAME } from "@/constants";
import { BadRequest, TimeoutException } from "@/lib/exceptions";
import { FacebookVideoResource } from "@/types/api/downloader";
import { getTimedFilename } from "@/utils";
import { DOMParser } from "xmldom";

export const getFbContentFileName = (
  type: string,
  res: string,
  ext: string
) => {
  return getTimedFilename(`${APP_NAME}_${type}_${res}`, ext);
};

export const handleScraperError = (error: Error) => {
  console.error("Scraper error:", error.message);
  if (error.message.includes("status code 404")) {
    throw new BadRequest("This post is private or does not exist", 404);
  } else if (error instanceof TimeoutException) {
    throw new TimeoutException();
  }
};

export const parseDashManifest = ({
  dashManifest,
  thumbnail,
  isLive,
}: {
  dashManifest: string;
  thumbnail?: string | null;
  isLive?: boolean;
}): Array<FacebookVideoResource> => {
  if (!dashManifest) {
    return [];
  }
  // Parse the XML string into a DOM object
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(dashManifest, "application/xml");

  // Extract all Representation elements
  const representations = xmlDoc.getElementsByTagName("Representation");

  const urlFieldKey = isLive ? "FBRepresentationMPDURL" : "BaseURL";

  // Map the representations to an array of objects
  const videoInfoList = Array.from(representations).map((rep: any) => {
    const mime_type = rep.getAttribute("mimeType");
    const id = rep.getAttribute("id");
    const baseURL = rep.getElementsByTagName(urlFieldKey)[0]?.textContent || "";

    if (mime_type.includes("audio")) {
      if (isLive) return;
      const bitrate = "128kbps";
      const audioInfo: FacebookVideoResource = {
        id,
        type: mime_type.split("/")[0],
        mime_type,
        bitrate,
        baseURL,
        has_audio: true,
        filename: getFbContentFileName(
          "AUD",
          bitrate,
          mime_type.split("/").at(-1)
        ),
      };
      return audioInfo;
    }
    const quality = rep.getAttribute("FBQualityLabel");
    const width = rep.getAttribute("width");
    const height = rep.getAttribute("height");

    const videoInfo: FacebookVideoResource = {
      id,
      type: mime_type.split("/")[0],
      mime_type,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      quality,
      baseURL,
      has_audio: false,
      filename: getFbContentFileName(
        "VID",
        quality,
        mime_type.split("/").at(-1)
      ),
    };
    if (thumbnail) videoInfo.thumbnail = thumbnail;
    return videoInfo;
  });

  return videoInfoList.filter(
    (i): i is FacebookVideoResource => !!i && !!i.baseURL
  );
};
