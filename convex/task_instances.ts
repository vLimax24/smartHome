import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTaskInstance = mutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
    date: v.string(),
    scheduleId: v.id("task_schedules"),
  },
  handler: async ({ db }, args) => {
    const newNote = await db.insert("task_instances", {
      user: args.userId,
      status: args.status,
      date: args.date,
      schedule: args.scheduleId,
    });

    return newNote;
  },
});

export const checkIfCompleted = query({
  args: {
    userId: v.id("users"),
    schedule: v.id("task_schedules"),
    date: v.string(),
  },
  handler: async ({ db }, args) => {
    const completed = await db
      .query("task_instances")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .filter((q) => q.eq(q.field("schedule"), args.schedule))
      .first();

    return completed;
  },
});
