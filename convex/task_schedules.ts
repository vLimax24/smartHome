import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTasksForDay = query({
  args: {
    day: v.number(),
    userId: v.id("users"),
  },
  handler: async ({ db }, args) => {
    const tasks = await db
      .query("task_schedules")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .filter((q) => q.eq(q.field("dayOfWeek"), args.day))
      .collect();

    return tasks;
  },
});
