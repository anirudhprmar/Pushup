import { api, HydrateClient } from "~/trpc/server";

import { redirect } from "next/navigation";
import HabitVisualizer from "../habits/_components/HabitVisualizer";
import UserProgress from "./_components/UserProgress";
import MonthlyAnalysis from "./_components/MonthlyAnalysis";


export default async function profile() {

  const user = await api.user.me();

  if (!user) {
    redirect("/login")
  }

  const date = new Date().toISOString().split("T")[0]!
  const year = date.split('-')[0]
  
  return (
    <HydrateClient>
      <div className="min-h-screen ">
        <div className=" mx-auto max-w-4xl p-3 ">
        
        <div className="flex items-center justify-around gap-2">
            <h1 className="font-bold text-3xl">Hi!, {user.name.split(" ")[0]}</h1>
            <p className="text-3xl text-muted-foreground tracking-tighter">{year}</p>
        </div>
          
        <div className="flex flex-col items-center justify-center w-fit mx-auto py-10">
          <HabitVisualizer/>
          <UserProgress/>
        </div>

        <div>
          {/* last 90 days progress of each habit just like habit analysis, progress i made in this month: monthly analysis like jan : habit completion rate & no. of tasks completed,  */}
          {/* <p className="text-muted-foreground">Last 90 days</p> */}
          <MonthlyAnalysis/>
        </div>

        </div>
      </div>
    </HydrateClient>
  );
}