import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

export const handler: Handlers<string | undefined> = {
  GET(req, ctx) {
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
    return ctx.render(username);
  },
};

export default function Home({ data }: PageProps<string>) {
  return (
    <>
      <Head>
        <title>bpr</title>
      </Head>
      <h1>Username found! -- {data} --</h1>
    </>
  );
}
