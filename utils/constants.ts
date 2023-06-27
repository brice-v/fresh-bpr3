export type AuthToken = {
  username: string;
  auth: string;
} | null;

export enum TRPCQuery {
  GetPostsByUser = "getPostByUser",
}

export enum TRPCMutation {
  CreateUser = "createUser",
  CreatePost = "createPost",
}

export const Username = "username";

export enum RedisKeys {
  Auths = "auths",
  Users = "users",
  NextUserId = "next_user_id",
  NextPostId = "next_post_id",
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
