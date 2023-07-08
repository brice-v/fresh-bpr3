import { connect } from "@planetscale/database";
import * as bcrypt from "@bcrypt";
import { AuthToken, EnvVars, Post } from "../utils/constants.ts";
import { ENV } from "../utils/utils.ts";

const config = {
  host: ENV[EnvVars.PlanetscaleHost],
  username: ENV[EnvVars.PlanetscaleUsername],
  password: ENV[EnvVars.PlanetscalePassword],
};

const USERS_MIGRATION_SCRIPT = `CREATE TABLE IF NOT EXISTS bpr_users(
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (username)
);`;
const POSTS_MIGRATION_SCRIPT = `CREATE TABLE IF NOT EXISTS bpr_posts(
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    content text NOT NULL,
    timestamp TIMESTAMP,
    PRIMARY KEY (id)
);`;
const FOLLOWERS_MIGRATION_SCRIPT = `CREATE TABLE IF NOT EXISTS bpr_followers(
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    follower varchar(255) NOT NULL,
    PRIMARY KEY (id)
);`;
const USERS_AUTH_MIGRATION_SCRIPT = `CREATE TABLE IF NOT EXISTS bpr_auths(
    username varchar(255) NOT NULL,
    authToken varchar(255) NOT NULL,
    PRIMARY KEY (username)
);`;

export async function runMigrations() {
  const c = connect(config);
  const usersMigrateResult = await c.execute(USERS_MIGRATION_SCRIPT);
  console.log("runMigrations::usersMigrateResult: ", usersMigrateResult);
  const postsMigrateResult = await c.execute(POSTS_MIGRATION_SCRIPT);
  console.log("runMigrations::postsMigrateResult: ", postsMigrateResult);
  const followersMigrateResult = await c.execute(FOLLOWERS_MIGRATION_SCRIPT);
  console.log(
    "runMigrations::followersMigrateResult: ",
    followersMigrateResult,
  );
  const usersAuthMigrationResult = await c.execute(USERS_AUTH_MIGRATION_SCRIPT);
  console.log(
    "runMigrations::usersAuthMigrationResult: ",
    usersAuthMigrationResult,
  );
}

const LOGIN_SCRIPT = `SELECT password FROM bpr_users where username = ?;`;
export async function login(
  username: string,
  password: string,
): Promise<AuthToken> {
  const c = connect(config);
  try {
    const { rows } = await c.execute(LOGIN_SCRIPT, [username]);
    console.log("rows = ", rows);
    const pw = rows[0].password;
    if (await bcrypt.compare(password, pw)) {
      const { rows } = await c.execute(USER_AUTH_SCRIPT, [username]);
      const authTokenId = rows[0].authToken;
      return { username: username, auth: authTokenId };
    }
    console.error("login: password did not match");
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

const USER_AUTH_SCRIPT = `SELECT authToken from bpr_auths where username = ?;`;
export async function isValidUser(
  username: string,
  userAuthId: string,
): Promise<boolean> {
  const c = connect(config);
  try {
    const { rows } = await c.execute(USER_AUTH_SCRIPT, [username]);
    const atid = rows[0].authToken;
    return atid === userAuthId;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const CREATE_NEW_POST_SCRIPT =
  `INSERT INTO bpr_posts (username, content, timestamp) VALUES (?, ?, ?);`;
export async function createNewPost(post: Post) {
  const c = connect(config);
  const result = await c.execute(CREATE_NEW_POST_SCRIPT, [
    post.author,
    post.content,
    post.timestamp,
  ]);
  console.log("createNewPost: result = ", result);
}

const CREATE_NEW_USER_SCRIPT =
  `INSERT INTO bpr_users (username, password) VALUES (?, ?);`;
const CREATE_NEW_USER_AUTH_SCRIPT =
  `INSERT INTO bpr_auths (username, authToken) VALUES (?, ?);`;
export async function createNewUser(username: string, password: string) {
  if (!username || username.length === 0 || username === "") return;
  if (!password || password.length === 0 || password === "") return;
  const c = connect(config);
  const hashedPw = await bcrypt.hash(password);
  const usersInsertResult = await c.execute(CREATE_NEW_USER_SCRIPT, [
    username,
    hashedPw,
  ]);
  console.log("createNewUser::usersInsertResult: ", usersInsertResult);
  const userAuthId = crypto.randomUUID();
  const usersAuthInsertResult = await c.execute(CREATE_NEW_USER_AUTH_SCRIPT, [
    username,
    userAuthId,
  ]);
  console.log("createNewUser::usersAuthInsertResult: ", usersAuthInsertResult);
}
