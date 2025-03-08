import type { AllTables } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const idAndUserIdFilter = (
  table: AllTables,
  props: { userId: string; id: string },
) => and(eq(table.id, props.id), eq(table.userId, props.userId));
