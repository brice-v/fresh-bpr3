import { HandlerContext } from "$fresh/server.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../router.ts";
import { getBaseUrl } from "../../../utils/utils.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const trpcRes = await fetchRequestHandler({
    endpoint: `${getBaseUrl(req)}/api/trpc`,
    req,
    router: appRouter,
    createContext: () => ({}),
  });

  return new Response(trpcRes.body, {
    headers: trpcRes.headers,
    status: trpcRes.status,
  });
};
