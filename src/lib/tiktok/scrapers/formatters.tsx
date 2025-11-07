import { BadRequest } from "@/lib/exceptions";
import { getTiktokContentFileName } from "./helper";
import { TiktokResource, TiktokResponse } from "@/types/api/downloader";

export const formatTiktokJson = async (data: any): Promise<TiktokResponse> => {
  if (!data) {
    throw new BadRequest("This post does not exist");
  }

  const { resources, ...rest } = data;

  const updatedResources = await Promise.all(
    resources.map(async (res: TiktokResource) => ({
      ...res,
      filename: getTiktokContentFileName(res.type, res.mime_type.split("/")[1]),
    }))
  );

  const json: TiktokResponse = {
    ...rest,
    resources: updatedResources,
  };

  return json;
};
