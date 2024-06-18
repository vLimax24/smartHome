"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import Avatar1 from "../../public/avatar1.svg";
import Avatar2 from "../../public/avatar2.svg";
import Avatar4 from "../../public/avatar4.svg";
import Avatar9 from "../../public/avatar9.svg";
import Avatar10 from "../../public/avatar10.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const users = useQuery(api.users.getUsers);

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center flex-col justify-center h-[80vh]">
        <h1 className="text-[2.5rem] font-bold mb-10">Wer schaut gerade?</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {users?.map((user: Doc<"users">) => (
            <Link
              key={user._id}
              className="flex flex-col items-center"
              href={`/plan/${user._id}`}
            >
              <div className="relative bg-gray-200 rounded-full p-6">
                <Image
                  src={getAvatarImage(user.profileImage)}
                  alt="User"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
              <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to select the correct avatar image based on user's profileImage
function getAvatarImage(profileImage: string) {
  switch (profileImage) {
    case "boy":
      return Avatar9;
    case "girl":
      return Avatar2;
    case "man":
      return Avatar4;
    case "woman":
      return Avatar10;
    default:
      return Avatar1; // Default fallback
  }
}
