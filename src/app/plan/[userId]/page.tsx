"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useFetchTasks } from "@/hooks/useFetchTasks";
import {
  WashingMachine,
  Trash2,
  Shapes,
  Utensils,
  Beef,
  Paintbrush,
  ShoppingBag,
  ChevronLeft,
  Check,
} from "lucide-react";
import Image from "next/image";
import VacuumCleaner from "../../../../public/vacuum-cleaner.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TaskDisplay = ({ params }: { params: { userId: string } }) => {
  const [dailyTasks, setDailyTasks] = useState<any[]>([]);
  const [completedStatuses, setCompletedStatuses] = useState<{
    [key: string]: boolean;
  }>({});
  const user = useQuery(api.users.getUser, {
    userId: params.userId as Id<"users">,
  });
  const dayOfWeekInNumber = new Date().getDay();
  const daysOfWeek = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];
  const today = daysOfWeek[dayOfWeekInNumber];

  const dailyTasksQuery = useFetchTasks(params.userId, dayOfWeekInNumber);
  const createNewInstance = useMutation(api.task_instances.createTaskInstance);

  useEffect(() => {
    if (dailyTasksQuery && dailyTasksQuery !== dailyTasks) {
      setDailyTasks(dailyTasksQuery);
    }
  }, [dailyTasksQuery, dailyTasks]);

  useEffect(() => {
    if (dailyTasks.length > 0) {
      const status = dailyTasks.reduce((acc, task) => {
        acc[task._id] = false;
        return acc;
      }, {});
      setCompletedStatuses(status);
    }
  }, [dailyTasks]);

  const handleTaskCompletion = useCallback(
    (taskId: string, isCompleted: boolean) => {
      setCompletedStatuses((prev) => ({ ...prev, [taskId]: isCompleted }));
    },
    []
  );

  const areAllTasksCompleted = Object.values(completedStatuses).every(
    (status) => status
  );

  return (
    <div className="flex flex-col">
      {/* Top navigation */}
      <div className="flex items-center justify-start p-4">
        <Link href="/" className="flex items-center space-x-2">
          <ChevronLeft size={24} />
          <span>Zurück</span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-10">
          Heute ist {today}...
        </h1>
        <div className="flex gap-8">
          {dailyTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl font-semibold">Keine Aufgaben</p>
            </div>
          ) : (
            dailyTasks.map((task) => (
              <Task
                key={task._id}
                taskId={task.task}
                userId={params.userId as Id<"users">}
                scheduleId={task._id}
                onCompletionStatusChange={handleTaskCompletion}
              />
            ))
          )}
        </div>
        {!areAllTasksCompleted && (
          <div className="w-full flex items-center justify-center">
            <Button
              className="flex gap-2 w-1/4 mt-16 h-12 border-blue-600 bg-transparent border-2 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => {
                dailyTasks.forEach(async (schedule) => {
                  await createNewInstance({
                    date: new Date().toISOString(),
                    status: "completed",
                    scheduleId: schedule._id,
                    userId: params.userId as Id<"users">,
                  });
                });
              }}
            >
              <Check />
              <p>Fertig</p>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

type TaskProps = {
  taskId: Id<"tasks">;
  userId: Id<"users">;
  scheduleId: Id<"task_schedules">;
  onCompletionStatusChange: (taskId: string, isCompleted: boolean) => void;
};

const Task: React.FC<TaskProps> = ({
  taskId,
  userId,
  scheduleId,
  onCompletionStatusChange,
}) => {
  const task = useQuery(api.tasks.getTask, { taskId: taskId });
  const isCompletedQuery = useQuery(api.task_instances.checkIfCompleted, {
    userId,
    schedule: scheduleId,
    date: new Date().toISOString().split("T")[0],
  });

  const isCompleted = isCompletedQuery?.status === "completed";

  useEffect(() => {
    if (isCompletedQuery) {
      onCompletionStatusChange(scheduleId, isCompleted);
    }
  }, [isCompletedQuery, scheduleId, onCompletionStatusChange]);

  return (
    <div className="flex flex-col items-center">
      {task && (
        <>
          <div
            className={`size-56 md:size-72 lg:size-80 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-600" : "bg-blue-600"}`}
          >
            {isCompleted ? (
              <Check className="size-[50%] text-white" />
            ) : (
              <>
                {task.name === "Wäsche" && (
                  <WashingMachine className="size-[50%] text-white" />
                )}
                {task.name === "Müll" && (
                  <Trash2 className="size-[50%] text-white" />
                )}
                {task.name === "Kinderzimmer" && (
                  <Shapes className="size-[50%] text-white" />
                )}
                {task.name === "Geschirrspüler" && (
                  <Utensils className="size-[50%] text-white" />
                )}
                {task.name === "Kochen" && (
                  <Beef className="size-[50%] text-white" />
                )}
                {task.name === "Wohnzimmer + Flur" && (
                  <Paintbrush className="size-[50%] text-white" />
                )}
                {task.name === "Einkaufen" && (
                  <ShoppingBag className="size-[50%] text-white" />
                )}
                {task.name === "Staubsaugen" && (
                  <Image
                    src={VacuumCleaner}
                    alt="Vacuum Cleaner"
                    className="size-[50%] text-white"
                    draggable={false}
                  />
                )}
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold mt-4">
            {isCompleted ? "Alles Erledigt" : task.name}
          </h1>
        </>
      )}
    </div>
  );
};

export default TaskDisplay;
