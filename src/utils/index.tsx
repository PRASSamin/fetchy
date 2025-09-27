import axios, { AxiosRequestConfig } from "axios";
import {
  ClientException,
  ServerException,
  TimeoutException,
} from "@/lib/exceptions";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BadRequest } from "@/lib/exceptions";
import { FETCHY_API_KEY } from "@/conf";
import crypto from "crypto";

export const getTimedFilename = (name: string, ext: string) => {
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  return `${name}-${timeStamp}.${ext}`;
};

export const SuccessResponse = (data: any) => {
  const response = {
    status: "success",
    data: data,
  };

  return response;
};

export const ErrorResponse = (message: string = "Something went wrong") => {
  const response = {
    status: "error",
    error: message,
  };

  return response;
};

export const HttpRequest = async ({ ...args }: AxiosRequestConfig) => {
  try {
    const response = await axios(args);
    return response;
  } catch (err: any) {
    if (err.response) {
      console.error("Axios Error: ", err.message);
      throw new ClientException(err.message);
    } else if (err.request) {
      console.error("Request Error: ", err.request);
      throw new TimeoutException();
    } else {
      console.error("Server Error: ", err.message);
      throw new ServerException();
    }
  }
};

export const downloadFile = async (
  url: string,
  filename: string,
  filetype: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>> | null = null
) => {
  if (setLoading) setLoading(true);
  try {
    if (filetype === "image") {
      const response = await axios.get(`/api/download`, {
        params: {
          url: url,
        },
        responseType: "json",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      const { data, contentType } = response.data;
      const uint8Array = new Uint8Array(data.data);
      const blob = new Blob([uint8Array], { type: contentType });
      saveAs(blob, `${filename.split(".")[0]}.${contentType.split("/")[1]}`);
    } else {
      const response = await axios.get(url, {
        responseType: "blob",
      });

      saveAs(response.data, filename);
    }
  } catch (err) {
    toast.error("Failed to download file");
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const renderVideo = async (
  videoUrl: string,
  audioUrl: string,
  filename: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>> | null = null
) => {
  if (setLoading) setLoading(true);
  try {
    const response = await axios.post(
      "/api/render",
      { video: videoUrl, audio: audioUrl },
      {
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    let data;
    if (typeof response.data === "string") {
      try {
        data = JSON.parse(response.data);
      } catch (err) {
        console.error(err);
      }
    } else data = response.data;

    await downloadFile(data.url, filename, "video", setLoading);
  } catch (err) {
    console.error(err);
    toast.error("Failed to render the video");
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const fetchImageDimensions = (url: string) => {
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isRedirectorUrl = ({
  regex,
  url,
}: {
  regex: RegExp[];
  url: string;
}) => {
  const redirectorPatterns = regex;
  return redirectorPatterns.some((pattern) => pattern.test(url));
};

export const resolveRedirectUrl = async ({
  url,
  headers,
  maxHops = 25,
}: {
  url: string;
  headers?: Record<string, string>;
  maxHops?: number;
}): Promise<{ url: string; html: string }> => {
  let currentUrl = url;
  let hopCount = 0;

  while (hopCount < maxHops) {
    try {
      const response = await axios.get(currentUrl, {
        maxRedirects: 0,
        headers,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers.location
      ) {
        currentUrl = response.headers.location.startsWith("http")
          ? response.headers.location
          : new URL(response.headers.location, currentUrl).toString();
        hopCount++;
      } else {
        return { url: currentUrl, html: response.data };
      }
    } catch (error: any) {
      if (error.response && error.response.headers?.location) {
        currentUrl = error.response.headers.location.startsWith("http")
          ? error.response.headers.location
          : new URL(error.response.headers.location, currentUrl).toString();
        hopCount++;
      } else {
        console.error("Failed to resolve redirect URL:", error);
        throw new BadRequest(`Failed to resolve redirect URL`);
      }
    }
  }

  throw new BadRequest("Too many redirect hops");
};

export function hash({
  ip,
  userAgent,
  ...rest
}: { ip: string; userAgent: string } & Record<string, unknown>): string {
  const sortedRest = Object.fromEntries(
    Object.entries(rest).sort((a, b) => a[0].localeCompare(b[0]))
  );
  const data = `${FETCHY_API_KEY}-${ip}-${userAgent}-${JSON.stringify(
    sortedRest
  )}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export const formatedTime = (time: Date | string) => {
  const currentTime = Date.now();
  const ts = new Date(time).getTime();
  const timeDifference = currentTime - ts;

  const oneDay = 24 * 60 * 60 * 1000;

  if (timeDifference > oneDay) {
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  }
};

export function getFlag(code: string) {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
