import { Data } from "../[id]/page";
import ErrorRequestsVaultView from "./view";
import { redis } from "@/lib/redis";

export default async function ErrorRequestsVault() {
  const keys = await redis.keys("req:P*");
  const values: { key: string; value: Data }[] = await Promise.all(
    keys.map(async (key) => {
      return { key: key, value: (await redis.get(key)) as Data };
    })
  );

  return <ErrorRequestsVaultView values={values} />;
}
