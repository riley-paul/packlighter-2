import { z, type ZodError } from "zod";
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

export type Env = z.infer<typeof zEnv>;

let env: Env;

try {
  env = zEnv.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("❌ Invalid environment variables:");
  console.error(error.flatten());
  process.exit(1);
}

export default env;
