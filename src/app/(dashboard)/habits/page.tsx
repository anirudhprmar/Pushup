"use client"
import { api } from "~/lib/api";
import { HabitCard } from "~/components/HabitCard";
import { useRouter } from "next/navigation";
import { Activity, TreeDeciduous } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HabitForm } from "../_components/HabitForm";
import { HabitsProgressList } from "./_components/HabitsProgressList";
import SkeletonHabits from "./_components/SkeletonHabits";


export default function Home() {
const router = useRouter()

const {data:userHabits,isLoading,error} = api.habits.getHabits.useQuery()

  if(error?.data?.code === "UNAUTHORIZED"){
    return router.push("/login")
  }

  if(!userHabits) return;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Habits</h1>
            <HabitForm />
          </div>
        </header>
    
        {isLoading ? (
          <SkeletonHabits />
        ) : (
          <div className="space-y-6">
            <section aria-labelledby="current-habits-title">
              <Card className="bg-secondary w-full max-w-4xl">
                <CardHeader>
                  <CardTitle id="current-habits-title" className="text-lg font-medium flex items-center gap-2">
                    <TreeDeciduous className="text-primary" aria-hidden="true" />
                    Current Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userHabits.length === 0 ? (
                    <p className="text-muted-foreground p-4">No habits found. Start by creating a new habit!</p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-2">
                      {userHabits.map((habit) => (
                        <li key={habit.habits.id}>
                          <HabitCard habit={habit} />
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
             
            <section aria-labelledby="habit-consistency-title">
              <Card className="bg-secondary w-full max-w-4xl">
                <CardHeader className="pb-2">
                  <CardTitle id="habit-consistency-title" className="text-lg font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
                    Habit Consistency
                    <span className="text-xs font-normal text-muted-foreground ml-auto">over 365 days</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 gap-2">
                    {userHabits.map((habit) => (
                      <li key={habit.habits.id}>
                        <HabitsProgressList habit={habit} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
