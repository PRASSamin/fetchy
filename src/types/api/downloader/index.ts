export type FacebookContentType = "video" | "story" | "highlight";
export interface FacebookResource {
  id: string;
  type: "image" | "video" | "audio";
  mime_type: string;
  quality?: string;
  bitrate?: string;
  has_audio: boolean;
  width?: number;
  height?: number;
  baseURL: string;
  filename: string;
}

export interface FacebookVideoResource extends FacebookResource {
  thumbnail?: string;
}

export interface Owner {
  id: string;
  name: string;
  username?: string;
  profile_pic: string;
  profile_url: string;
}

export interface FacebookVideoResponse {
  id: string;
  owner: Owner;
  title?: string;
  type: "live" | "video";
  thumbnail?: string | null;
  resources: FacebookVideoResource[];
}

export interface FacebookStoryResponse {
  id: string;
  owner: Owner;
  type: "story";
  thumbnail?: string | null;
  stories: {
    id: string;
    type: "image" | "video" | "audio";
    resources: FacebookResource[];
    thumbnail: string;
  }[];
}

export type FacebookResponse = FacebookVideoResponse | FacebookStoryResponse;

export type InstagramContentType = "post" | "reel" | "story" | "highlight";

export interface InstagramResource extends FacebookResource {
  thumbnail?: string;
}

export interface InstagramResponse {
  id: string;
  owner: Owner;
  type: "post" | "reel" | "story";
  thumbnail?: string;
  resources: InstagramResource[];
}

export interface InstagramStoryResponse {
  id: string;
  owner: Owner;
  type: "story";
  thumbnail?: string | null;
  stories: {
    id: string;
    type: "image" | "video" | "audio";
    resources: InstagramResource[];
    thumbnail: string;
  }[];
}

export interface TiktokResource extends FacebookResource {
  thumbnail?: string;
  has_watermark?: boolean;
}

export interface TiktokResponse {
  id: string;
  owner: Owner;
  thumbnail?: string;
  title?: string;
  type: "video" | "audio" | "slideshow";
  resources: TiktokResource[];
}
