import { APP_NAME } from "@/constants";
import { getTimedFilename } from "@/utils";

export const getTiktokContentFileName = (type: string, ext: string) => {
  return getTimedFilename(`${APP_NAME}_${type}`, ext);
};
