import { Redis } from "@upstash/redis";
import * as bcrypt from "@bcrypt";
import { AuthToken, RedisKeys } from "./constants.ts";

const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL") || "",
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN") || "",
});

export async function login(
  username: string,
  password: string,
): Promise<AuthToken> {
  if (!username || !password) {
    console.error(
      `username (${username}) or password (${password}) is empty or null`,
    );
    return null;
  }
  // TODO: Potentially use hgetall here
  const userId = await redis.hget<number>("users", username);
  if (!userId) {
    console.error(`userId does not exist for username ${username}`);
    return null;
  }
  const pwHash = await redis.hget<string>(`${username}:${userId}`, "password");
  if (!pwHash) {
    console.error(
      `pwHash does not exist for username:userId ${username}:${userId}`,
    );
    return null;
  }
  const authUUID = await redis.hget<string>(`${username}:${userId}`, "auth");
  if (!authUUID) {
    console.error(
      `authUUID does not exist for username:userId ${username}:${userId}`,
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
      `username (${username}) or authUUID (${authUUID}) is empty or null`,
    );
    return false;
  }
  console.log(`username (${username}), authUUID (${authUUID})`);
  // Get user id from users using username
  const userId = await redis.hget<number>(RedisKeys.Users, username);
  // get auth from auths using userid
  const authUserId = await redis.hget<string>(RedisKeys.Auths, `${authUUID}`);
  console.log(`userId (${userId}), authUserId (${authUserId})`);
  // Verify the 2 match then return true
  return authUserId === userId;
}

export async function createNewUser(username: string, password: string) {
  if (!username || username.length === 0) return;
  console.log("username", username);
  const hash = await bcrypt.hash(password);
  console.log("hash", hash);
  const userId = await redis.incr(RedisKeys.NextUserId);
  const authUUID = crypto.randomUUID();
  const userUpdate = await redis.hset(`${username}:${userId}`, {
    username,
    password: hash,
    auth: authUUID,
  });
  if (userUpdate !== 3) {
    console.error("userUpdate was not 3, got =", userUpdate);
    return;
  }
  const users_val: { [index: string]: string } = {};
  users_val[`${username}`] = `${userId}`;
  const usersUpdate = await redis.hset(RedisKeys.Users, users_val);
  if (usersUpdate !== 1) {
    console.error("usersUpdate was not 1, got =", usersUpdate);
    return;
  }
  const authUUID_val: { [index: string]: string } = {};
  authUUID_val[`${authUUID}`] = `${userId}`;
  const authsUpdate = await redis.hset(RedisKeys.Auths, authUUID_val);
  if (authsUpdate !== 1) {
    console.error("authsUpdate was not 1, got =", authsUpdate);
    return;
  }
}
