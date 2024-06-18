import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async ({ db }, args) => {
    const task = await db
      .query("tasks")
      .filter((q) => q.eq(q.field("_id"), args.taskId))
      .first();

    return task;
  },
});
