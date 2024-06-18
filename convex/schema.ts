import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    name: v.string(),
    duration: v.number(),
    priotrity: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    profileImage: v.string(),
  }),
  task_schedules: defineTable({
    dayOfWeek: v.number(),
    task: v.id("tasks"),
    user: v.id("users"),
    frequency: v.number(),
  }),
});
