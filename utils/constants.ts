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
