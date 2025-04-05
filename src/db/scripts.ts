import env from "@/envs-runtime";
import { createDb } from ".";
import { User } from "./schema";

export const deleteAllData = async () => {
  const db = createDb(env);
  await Promise.all([db.delete(User)]);
};
