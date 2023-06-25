import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import Timeline from "../islands/Timeline.tsx";
import CreatePostWizard from "../islands/CreatePostWizard.tsx";

export const handler: Handlers<string | undefined> = {
  GET(req, ctx) {
    const { username } = getCookies(req.headers);
    console.log("index::GET::handler: username", username);
    if (!username) {
      return Response.redirect("/login");
    }
    return ctx.render(username);
  },
};

export default function Home({ data }: PageProps<string>) {
  return (
    <>
      <CreatePostWizard author={data} />
      <Timeline author={data} />
    </>
  );
}
