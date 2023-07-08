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

export enum EnvVars {
  BprDevMode = "BPR_DEV_MODE",
  PlanetscaleHost = "DATABASE_HOST",
  PlanetscaleUsername = "DATABASE_USERNAME",
  PlanetscalePassword = "DATABASE_PASSWORD",
}

export type Post = {
  author: string;
  content: string;
  timestamp: Date;
};
