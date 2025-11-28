import { STAGE } from "@/constants/env";
import { redenv } from "./redenv";
import { SignJWT, jwtVerify, decodeJwt } from "jose";

const crypto = globalThis.crypto;

export interface TokenPayload {
  ip: string;
  userAgent: string;
  hashedApiKey: string;
  [key: string]: unknown;
}

export class TokenManager {
  constructor(private ttl: number = 60) {}

  private sortObject(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))
    );
  }

  private async hash({
    ip,
    userAgent,
    ...rest
  }: {
    ip: string;
    userAgent: string;
    [key: string]: unknown;
  }): Promise<string> {
    const env = await redenv.load();
    const sortedRest = this.sortObject(rest);
    const data = `${env.API_KEY}-${ip}-${userAgent}-${JSON.stringify(
      sortedRest
    )}`;

    const buffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(data)
    );

    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async createToken({
    ip,
    userAgent,
    ...rest
  }: {
    ip: string;
    userAgent: string;
    [key: string]: unknown;
  }): Promise<string> {
    const env = await redenv.load();
    const hashedApiKey = await this.hash({ ip, userAgent, ...rest });

    const payload: TokenPayload = {
      ip,
      userAgent,
      hashedApiKey,
      ...rest,
    };

    const secret = new TextEncoder().encode(env.API_KEY);

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${this.ttl}s`)
      .sign(secret);
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
      const secret = new TextEncoder().encode(env.API_KEY);

      const { payload } = await jwtVerify(token, secret);

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

  decodeToken(token: string): TokenPayload | null {
    try {
      return decodeJwt(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  isTokenValid(token: string): boolean {
    try {
      if (STAGE !== "production") return true;
      const decoded = decodeJwt(token);

      if (!decoded?.exp) return false;

      const now = Math.floor(Date.now() / 1000);
      return decoded.exp >= now;
    } catch {
      return false;
    }
  }
}
