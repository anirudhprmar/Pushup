"use client"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/lib/api"
import { TaskForm } from "./_components/TaskForm";
import { TaskCard } from "./_components/TaskCard";
import SkeletonTasks from "./_components/SkeletonTasks";
import dateAndactualMonth from "~/lib/day&months";


export default function Tasks() {
  const {data:userTasks,isLoading,error} = api.tasks.listAllTasks.useQuery()
  const router = useRouter()

  
    if(error?.data?.code === "UNAUTHORIZED"){
      return router.push("/login")
    }
  
    if(!userTasks) return;

    const date = new Date().toISOString().split("T")[0]!;
    const todaysDate = dateAndactualMonth(date)
    console.log(date)
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            <TaskForm />
          </div>
        </header>

        {isLoading ? (
          <SkeletonTasks />
        ) : (
          <div className="space-y-6">
            <section aria-labelledby="today-tasks-title">
              <Card className="bg-secondary w-full max-w-4xl">
                <CardHeader>
                  <CardTitle id="today-tasks-title" className="text-lg font-medium">
                    {todaysDate}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!userTasks || userTasks.length === 0 ? (
                    <p className="text-muted-foreground">No Tasks found. Start by creating a new task!</p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-2">
                      {userTasks.map((task) => (
                        <li key={task.id}>
                          <TaskCard userTask={task} />
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
