import { createDb } from "@/db";
import { User } from "@/db/schema";
import env from "@/envs-runtime";

export const USER_ID = crypto.randomUUID();

export const seedTestData = async () => {
  const db = createDb(env);

  await db.insert(User).values({
    id: USER_ID,
    name: "Test User",
    email: "test-user@example.com",
  });
};
