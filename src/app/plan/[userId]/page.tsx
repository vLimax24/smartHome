"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (dailyTasksQuery) {
      setDailyTasks(dailyTasksQuery);
    }
  }, [dailyTasksQuery]);

  return (
    <div className="flex flex-col">
      {/* Top navigation */}
      <div className="flex items-center justify-start p-4">
        {/* Back button */}
        <Link href="/" className="flex items-center space-x-2">
          <ChevronLeft size={24} />
          <span>Back</span>
        </Link>
      </div>

      {/* Task display */}
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-10">
          Heute ist {today}...
        </h1>
        <div className="flex gap-8">
          {dailyTasks.map((task) => (
            <Task key={task._id} taskId={task.task} />
          ))}
        </div>
        <div className="w-full flex items-center justify-center">
          <Button className="flex gap-2 w-1/4 mt-16 h-12 border-blue-600 bg-transparent border-2 text-blue-600 hover:bg-blue-600 hover:text-white">
            <Check />
            <p>Fertig</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

type TaskProps = {
  taskId: Id<"tasks">;
};

const Task: React.FC<TaskProps> = ({ taskId }) => {
  const task = useQuery(api.tasks.getTask, { taskId: taskId });

  return (
    <div className="flex flex-col items-center">
      {task && (
        <>
          <div className="size-56 md:size-72 lg:size-80 rounded-full bg-blue-600 flex items-center justify-center">
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
          </div>
          <h1 className="text-3xl font-bold mt-2">{task.name}</h1>
        </>
      )}
    </div>
  );
};

export default TaskDisplay;
