import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { STAGE } from "@/constants/env";
import { TokenManagerEdge } from "./security-edge";
import { redenv } from "./redenv";

export interface TokenPayload {
  ip: string;
  userAgent: string;
  hashedApiKey: string;
}

export class TokenManager extends TokenManagerEdge {
  constructor(private ttl: SignOptions["expiresIn"] = 60) {
    super();
  }

  private sortObject(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))
    );
  }

  private async hash({
    ip,
    userAgent,
    ...rest
  }: { ip: string; userAgent: string } & Record<
    string,
    unknown
  >): Promise<string> {
    const env = await redenv.load();
    const sortedRest = this.sortObject(rest);
    const data = `${env.API_KEY}-${ip}-${userAgent}-${JSON.stringify(sortedRest)}`;
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  async createToken({
    ip,
    userAgent,
    ...rest
  }: { ip: string; userAgent: string } & Record<
    string,
    unknown
  >): Promise<string> {
    const env = await redenv.load();
    const hashedApiKey = await this.hash({ ip, userAgent, ...rest });
    const payload: TokenPayload = { ip, userAgent, hashedApiKey, ...rest };

    return jwt.sign(payload, env.API_KEY, {
      expiresIn: this.ttl,
    });
  }

  async verifyToken({
    token,
    ip: currentIp,
    userAgent: currentUserAgent,
    ...rest
  }: {
    token: string;
    ip: string;
    userAgent: string;
    [key: string]: unknown;
  }): Promise<boolean> {
    try {
      if (STAGE !== "production") return true;
      const env = await redenv.load();
      const payload = jwt.verify(token, env.API_KEY) as TokenPayload;

      const currentHash = await this.hash({
        ip: currentIp,
        userAgent: currentUserAgent,
        ...rest,
      });

      return (
        payload.ip === currentIp &&
        payload.userAgent === currentUserAgent &&
        payload.hashedApiKey === currentHash
      );
    } catch (err) {
      console.error("Token verification failed:", err);
      return false;
    }
  }
}
