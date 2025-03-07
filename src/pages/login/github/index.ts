import { generateState } from "arctic";
import { github } from "@/modules/users/helpers/lucia";

import type { APIContext } from "astro";
import env from "@/envs";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  context.cookies.set("github_oauth_state", state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return context.redirect(url.toString());
}
