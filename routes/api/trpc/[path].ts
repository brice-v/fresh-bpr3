import { HandlerContext } from "$fresh/server.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../router.ts";
import { getBaseUrl } from "../../../utils/utils.ts";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getCookies } from "std/http/cookie.ts";
import { isValidUser } from "../../../db/db.ts";

async function createContext({
  req,
}: FetchCreateContextFnOptions) {
  const cookies = getCookies(req.headers);
  console.log("trpcContext::createContext: cookies = ", cookies);
  const { username } = cookies;
  const authUUID = cookies[`${username}`];
  console.log(
    "trpcContext::createContext: username = ",
    username,
    "authUUID = ",
    authUUID,
  );
  const userIsValid = await isValidUser(username, authUUID);
  console.log(
    "trpcContext::createContext username = ",
    username,
    ", userIsValid = ",
    userIsValid,
  );
  return { req, userIsValid, username };
}

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const trpcRes = await fetchRequestHandler({
    endpoint: `${getBaseUrl(req)}/api/trpc`,
    req,
    router: appRouter,
    createContext, // Note: We will use the context as defined above so we can have the username set
  });

  return new Response(trpcRes.body, {
    headers: trpcRes.headers,
    status: trpcRes.status,
  });
};
