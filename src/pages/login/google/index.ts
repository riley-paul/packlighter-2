import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/modules/users/helpers/lucia";

import type { APIContext } from "astro";
import env from "@/envs";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"],
  });

  context.cookies.set("google_oauth_state", state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    sameSite: "lax",
  });

  context.cookies.set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
