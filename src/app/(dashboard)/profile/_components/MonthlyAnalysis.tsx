"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Badge } from '~/components/ui/badge'
import { api } from '~/lib/api'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import SkeletonHabitProgress from './SkeletonHabitProgress'

export default function MonthlyAnalysis() {
  const currentYear = new Date().getFullYear()

  // Fetch monthly analysis data - all processing done on backend!
  const { data: monthlyStats, isLoading } = api.habits.getMonthlyAnalysis.useQuery()

  if (isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: new Date().getMonth() + 1 }).map((_, index) => (
          <SkeletonHabitProgress key={index} />
        ))}
      </div>
    )
  }

  if (!monthlyStats || monthlyStats.length === 0) {
    return (
      <Card className="mt-5 p-5">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No habits found. Create a habit to start tracking!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {monthlyStats.map((stat) => (
        <Card key={stat.month} className="mt-5 p-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{stat.monthName} {currentYear}</CardTitle>
                <CardDescription className="mt-1">
                  {stat.totalHabits} {stat.totalHabits === 1 ? 'habit' : 'habits'} active
                </CardDescription>
              </div>
              {stat.growth !== null && (
                <Badge
                  variant={stat.growth > 0 ? 'default' : stat.growth < 0 ? 'destructive' : 'secondary'}
                  className="flex items-center gap-1"
                >
                  {stat.growth > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : stat.growth < 0 ? (
                    <ArrowDown className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {Math.abs(stat.growth)}%
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Completion Rate</span>
                <span className="font-semibold">{stat.averageCompletionRate}%</span>
              </div>
              <Progress value={stat.averageCompletionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Days Completed</p>
                <p className="text-2xl font-bold">{stat.totalDaysCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Logged</p>
                <p className="text-2xl font-bold">{stat.totalDaysLogged}</p>
              </div>
            </div>

            {stat.habitsBreakdown.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-3">Per-Habit Breakdown</p>
                <div className="space-y-2">
                  {stat.habitsBreakdown.map((habit) => (
                    <div key={habit.habitId} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate flex-1">{habit.habitName}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-muted-foreground">
                          {habit.completedDays}/{habit.loggedDays}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {habit.completionRate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
