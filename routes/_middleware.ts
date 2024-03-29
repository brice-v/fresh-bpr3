import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { getBaseUrl } from "../utils/utils.ts";
import { isValidUser } from "../db/db.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);
  console.log("_middleware::handler: url.pathname = ", url.pathname);
  if (url.pathname === "/login" || url.pathname.startsWith("/api")) {
    return ctx.next();
  }
  const cookies = getCookies(req.headers);
  console.log("_middleware::handler: cookies = ", cookies);
  const { username } = cookies;
  const authUUID = cookies[`${username}`];
  console.log(
    "_middleware::handler: username = ",
    username,
    "authUUID = ",
    authUUID,
  );
  const userIsValid = await isValidUser(username, authUUID);
  if (userIsValid) {
    return ctx.next();
  }
  return Response.redirect(`${getBaseUrl(req)}/login`);
}
