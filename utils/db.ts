import { Redis } from "@upstash/redis";
import * as bcrypt from "@bcrypt";
import { AuthToken, EnvVars, Post, RedisKeys } from "./constants.ts";
import { ENV, isDevMode } from "./utils.ts";

const redis = new Redis({
  url: ENV[EnvVars.UpstashRedisRestURL] || "",
  token: ENV[EnvVars.UpstashRedisRestToken] || "",
});

export async function login(
  username: string,
  password: string,
): Promise<AuthToken> {
  if (!username || !password) {
    console.error(
      `db::login: username (${username}) or password (${password}) is empty or null`,
    );
    return null;
  }
  if (isDevMode()) {
    return { username, auth: `auth-token-${password}` };
  }
  // TODO: Potentially use hgetall here
  const userId = await redis.hget<number>("users", username);
  if (!userId) {
    console.error(`db::login: userId does not exist for username ${username}`);
    return null;
  }
  const pwHash = await redis.hget<string>(`${username}:${userId}`, "password");
  if (!pwHash) {
    console.error(
      `db::login: pwHash does not exist for username:userId ${username}:${userId}`,
    );
    return null;
  }
  const authUUID = await redis.hget<string>(`${username}:${userId}`, "auth");
  if (!authUUID) {
    console.error(
      `db::login: authUUID does not exist for username:userId ${username}:${userId}`,
    );
    return null;
  }
  if (await bcrypt.compare(password, pwHash)) {
    return { username, auth: authUUID };
  }
  return null;
}

export async function isValidUser(
  username: string,
  authUUID: string,
): Promise<boolean> {
  if (!username || !authUUID) {
    console.error(
      `db::isValidUser: username (${username}) or authUUID (${authUUID}) is empty or null`,
    );
    return false;
  }
  if (isDevMode()) {
    console.log("db::isValidUser: dev mode enabled, returning true");
    return true;
  }
  console.log(
    `db::isValidUser: username (${username}), authUUID (${authUUID})`,
  );
  // Get user id from users using username
  const userId = await redis.hget<number>(RedisKeys.Users, username);
  // get auth from auths using userid
  const authUserId = await redis.hget<string>(RedisKeys.Auths, `${authUUID}`);
  console.log(
    `db::isValidUser: userId (${userId}), authUserId (${authUserId})`,
  );
  // Verify the 2 match then return true
  return authUserId === userId;
}

export async function createNewPost(post: Post): Promise<number | undefined> {
  // increment next_post_id
  const postId = await redis.incr(RedisKeys.NextPostId);
  // Get user id from post.author
  const userId = await redis.hget<number>(RedisKeys.Users, post.author);
  // set a new post:postId authorId timestamp (as number) content
  const postsUpdate = await redis.hset(`posts:${postId}`, {
    userId: userId,
    timestamp: post.timestamp.getTime(),
    content: post.content,
  });
  if (postsUpdate !== 3) {
    console.error(
      "db::createNewPost: postsUpdate was not 3, got =",
      postsUpdate,
    );
    return;
  }
  return postId;
}

export async function createNewUser(username: string, password: string) {
  if (!username || username.length === 0) return;
  console.log("db::createNewUser: username", username);
  const hash = await bcrypt.hash(password);
  console.log("db::createNewUser:hash", hash);
  const userId = await redis.incr(RedisKeys.NextUserId);
  const authUUID = crypto.randomUUID();
  const userUpdate = await redis.hset(`${username}:${userId}`, {
    username,
    password: hash,
    auth: authUUID,
  });
  if (userUpdate !== 3) {
    console.error("db::createNewUser: userUpdate was not 3, got =", userUpdate);
    return;
  }
  const users_val: { [index: string]: string } = {};
  users_val[`${username}`] = `${userId}`;
  const usersUpdate = await redis.hset(RedisKeys.Users, users_val);
  if (usersUpdate !== 1) {
    console.error(
      "db::createNewUser: usersUpdate was not 1, got =",
      usersUpdate,
    );
    return;
  }
  const authUUID_val: { [index: string]: string } = {};
  authUUID_val[`${authUUID}`] = `${userId}`;
  const authsUpdate = await redis.hset(RedisKeys.Auths, authUUID_val);
  if (authsUpdate !== 1) {
    console.error(
      "db::createNewUser: authsUpdate was not 1, got =",
      authsUpdate,
    );
    return;
  }
}
