import RequestDetailsView from "./view";
import { redis } from "@/lib/redis";

export type Data = Record<string, any> & {
  body: Record<string, any>;
  headers: Record<string, any>;
  cookies: Record<string, any>;
  response: Record<string, any>;
};

export default async function RequestDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data: Data = await redis.get(`req:${id}`) as Data;

  return <RequestDetailsView data={data} id={id} />;
}
