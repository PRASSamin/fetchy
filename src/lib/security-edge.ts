import jwt from "jsonwebtoken";
import { TokenPayload } from "./security";
import { STAGE } from "@/constants/env";

export class TokenManagerEdge {
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  isTokenValid(token: string): boolean {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (STAGE !== "production") return true;
    if (!decoded || !decoded.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp >= now;
  }
}
