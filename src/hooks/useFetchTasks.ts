"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const useFetchTasks = (userId: string, dayOfWeekInNumber: number) => {
  return useQuery(api.task_schedules.getTasksForDay, {
    userId: userId as Id<"users">,
    day: dayOfWeekInNumber === 0 ? 7 : dayOfWeekInNumber,
  });
};
