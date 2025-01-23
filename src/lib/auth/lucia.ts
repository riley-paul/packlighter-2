import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db, eq, User, UserSession } from "astro:db";
import type { UserSelect, UserSessionSelect } from "../types";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<UserSessionSelect> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = {
    id: sessionId,
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };
  const [createdSession] = await db
    .insert(UserSession)
    .values(session)
    .returning();
  return createdSession;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: User, session: UserSession })
    .from(UserSession)
    .innerJoin(User, eq(UserSession.userId, User.id))
    .where(eq(UserSession.id, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const [{ user, session }] = result;

  // Check if the session has expired
  if (Date.now() >= new Date(session.expiresAt).getTime()) {
    await db.delete(UserSession).where(eq(UserSession.id, session.id));
    return { session: null, user: null };
  }

  // If the session is about to expire, extend it
  if (
    Date.now() >=
    new Date(session.expiresAt).getTime() - 1000 * 60 * 60 * 24 * 15
  ) {
    session.expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
    await db
      .update(UserSession)
      .set({ expiresAt: session.expiresAt })
      .where(eq(UserSession.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(UserSession).where(eq(UserSession.id, sessionId));
}

export type SessionValidationResult =
  | { session: UserSessionSelect; user: UserSelect }
  | { session: null; user: null };
