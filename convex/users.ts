import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUsers = query({
  args: {},
  handler: async ({ db }) => {
    const users = await db.query("users").collect();

    return users;
  },
});

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async ({ db }, args) => {
    const user = await db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();

    return user;
  },
});
