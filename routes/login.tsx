import { Handlers, PageProps } from "$fresh/server.ts";
import { Cookie, setCookie } from "std/http/cookie.ts";
import { login } from "../utils/db.ts";
import { Username } from "../utils/constants.ts";

export const handler: Handlers<string | undefined> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();
    if (!username || !password) {
      const error = "Username or Password cannot be empty";
      return ctx.render(error);
    }
    const resp = await login(username, password);
    if (!resp) {
      const error = "Failed to Login User";
      return ctx.render(error);
    }
    const url = new URL(req.url);
    // If its authenticated it returns the username as well as a token to use (thats stored in the DB as well)
    const headers = new Headers();
    const defaultCookieArgs: Partial<Cookie> = {
      maxAge: 60 * 60 * 4, // 4 Hours
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: url.hostname,
    };
    // Set a cookie for the auth
    setCookie(headers, {
      name: resp.username,
      value: resp.auth,
      ...defaultCookieArgs,
    });
    // Set a cookie for the username
    setCookie(headers, {
      name: Username,
      value: resp.username,
      ...defaultCookieArgs,
    });
    headers.set("location", "/");
    return new Response(null, {
      status: 302,
      headers,
    });
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
