import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: "DATABASE_URL",
  authToken: "DATABASE_AUTH_TOKEN",
});

const db = drizzle(client);
export default db;
