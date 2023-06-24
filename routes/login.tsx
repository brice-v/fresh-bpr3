import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "std/http/cookie.ts";
import { getBaseUrl } from "../utils/utils.ts";

export const handler: Handlers<string | undefined> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();
    if (!username || !password) {
      const error = "Username or Password cannot be empty";
      return ctx.render(error);
    }
    // TODO: Create api endpoint to authenticate user?

    const resp = await fetch(
      `${getBaseUrl(req)}/api/auth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    );
    console.log("resp", resp);
    console.log("resp.json()", await resp.json());
    if (resp.status !== 200) {
      const error = "Failed to authenticate";
      return ctx.render(error);
    }
    // If its authenticated it returns the username as well as a token to use (thats stored in the DB as well?)

    // This should be unreachable? If our auth method redirects and sets cookies
    return ctx.render();
  },
};

export default function Login({ data }: PageProps<string | undefined>) {
  return (
    <>
      <h1>bpr login!</h1>
      <p>
        bpr is a platform where you can post messages on a timeline and follow
        what others are saying!
      </p>
      {data && <span>{data}</span>}
      <form method="post">
        <input
          type="text"
          placeholder="Enter username..."
          name="username"
          autofocus={true}
          autocomplete="off"
          required
        />
        <input
          type="password"
          placeholder="Enter password..."
          name="password"
          autocomplete="off"
          required
        />
        <input type="submit" value="Login" />
      </form>
    </>
  );
}
