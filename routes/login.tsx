import { Handlers, PageProps } from "$fresh/server.ts";
import { Cookie, setCookie } from "std/http/cookie.ts";
import { login } from "../db/db.ts";
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
      <h1 class="text-2xl text-white">bpr login!</h1>
      <p class="text-white">
        bpr is a platform where you can post messages on a timeline and follow
        what others are saying!
      </p>
      {data && <span>{data}</span>}
      <form method="post" class="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter username..."
          name="username"
          autofocus={true}
          autocomplete="off"
          required
          class="text-xl text-white rounded-md bg-gray-900 border-2 rounded-md border-gray-900 hover:border-gray-200"
        />
        <input
          type="password"
          placeholder="Enter password..."
          name="password"
          autocomplete="off"
          required
          class="text-xl text-white rounded-md bg-gray-900 border-2 rounded-md border-gray-900 hover:border-gray-200"
        />
        <input
          type="submit"
          value="Login"
          class="text-xl text-white rounded-md p-1 bg-gray-700 border-2 rounded-md border-gray-900 hover:border-gray-200"
          style="cursor: pointer;"
        />
      </form>
    </>
  );
}
