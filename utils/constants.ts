export type AuthToken = {
  username: string;
  auth: string;
} | null;

export enum TRPCQuery {
  Login = "login",
  IsValidUser = "isValidUser",
}

export enum TRPCMutation {
  CreateUser = "createUser",
}

export const Username = "username";

export enum RedisKeys {
  Auths = "auths",
  Users = "users",
  NextUserId = "next_user_id",
}

export enum EnvVars {
  BprDevMode = "BPR_DEV_MODE",
  UpstashRedisRestURL = "UPSTASH_REDIS_REST_URL",
  UpstashRedisRestToken = "UPSTASH_REDIS_REST_TOKEN",
}

export type Post = {
  author: string;
  content: string;
  timestamp: Date;
};
