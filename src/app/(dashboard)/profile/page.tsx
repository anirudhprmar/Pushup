import { api, HydrateClient } from "~/trpc/server";
import TodaysProgress from "./_components/TodaysProgress";

import { ReviewNotes } from "./_components/ReviewNotes";
import { HabitsProgressList } from "./_components/HabitsProgressList";

import { redirect } from "next/navigation";

export default async function profile() {

  const user = await api.user.me();

  if (!user) {
    redirect("/login")
  }

  return (
    <HydrateClient>
      <div className="mx-auto p-3 min-h-screen  text-primary">
        <div className="flex items-center gap-2">
            <h1 className="font-bold text-3xl">Hi!, {user.name.split(" ")[0]}</h1>
        </div>
          

        <div className="flex  gap-4 items-start py-10 justify-center">

            <TodaysProgress/>
          <div className="flex flex-col items-center justify-center gap-5 w-full">
            <HabitsProgressList />
          <ReviewNotes/>
          </div>

        </div>

      </div>
    </HydrateClient>
  );
}