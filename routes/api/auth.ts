import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  // TODO: IN here we need to check the DB if the username and password
  const j = await req.json();
  if (!j) {
    return new Response(null, { status: 403 });
  }
  const { username, password } = j;
  const newbody = JSON.stringify({
    "username": username,
    "password": password,
  });
  const resp = new Response(newbody, {
    headers: { "Content-Type": "application/json;charset=utf8;" },
  });
  return resp;
};
