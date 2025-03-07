import { z } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const zEnv = z.object({
  NODE_ENV: z.string().default("development"),
  PROD: z.coerce.boolean().default(false),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  COOLIFY_FQDN: z.string().default("http://localhost:4321"),
});

const env = zEnv.parse(process.env);
export default env;
