import { github } from "@/modules/users/helpers/lucia";
import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import getGithubUser from "@/modules/users/helpers/get-github-user";
import { v4 as uuid } from "uuid";
import setUserSession from "@/modules/users/helpers/set-user-session";
import db from "@/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await getGithubUser(tokens.accessToken);

    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, githubUser.email))
      .then((rows) => rows[0]);

    if (existingUser) {
      await db
        .update(User)
        .set({ githubId: githubUser.id })
        .where(eq(User.id, existingUser.id));
      await setUserSession(context, existingUser.id);
      return context.redirect("/");
    }

    // add user to database
    const user = await db
      .insert(User)
      .values({
        id: uuid(),
        email: githubUser.email,
        githubId: githubUser.id,
        githubUsername: githubUser.login,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
      })
      .returning()
      .then((rows) => rows[0]);

    await setUserSession(context, user.id);
    return context.redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      console.log("Invalid code");
      console.error(e.message);
      return new Response(null, {
        status: 400,
      });
    }

    console.log("General server error");
    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
}
