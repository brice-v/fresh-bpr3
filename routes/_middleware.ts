import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<{ username: string }>,
) {
  const { username } = getCookies(req.headers);
  console.log("username", username);
  if (!username) {
    const headers = new Headers();
    headers.set("location", "/login");
    return new Response(null, {
      status: 302,
      headers,
    });
  }
  ctx.state.username = username;
  return await ctx.next();
}
