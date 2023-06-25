// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/_app.tsx";
import * as $2 from "./routes/_middleware.ts";
import * as $3 from "./routes/api/auth.ts";
import * as $4 from "./routes/api/joke.ts";
import * as $5 from "./routes/api/trpc/[path].ts";
import * as $6 from "./routes/index.tsx";
import * as $7 from "./routes/login.tsx";
import * as $$0 from "./islands/CreatePostWizard.tsx";
import * as $$1 from "./islands/Timeline.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/_app.tsx": $1,
    "./routes/_middleware.ts": $2,
    "./routes/api/auth.ts": $3,
    "./routes/api/joke.ts": $4,
    "./routes/api/trpc/[path].ts": $5,
    "./routes/index.tsx": $6,
    "./routes/login.tsx": $7,
  },
  islands: {
    "./islands/CreatePostWizard.tsx": $$0,
    "./islands/Timeline.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
