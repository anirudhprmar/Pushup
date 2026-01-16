import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "~/components/ui/card"

export default function SkeletonHabitProgress() {
  return (
    <Card className="mt-5 p-5">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32 rounded-sm" />
            <Skeleton className="h-4 w-24 rounded-sm" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40 rounded-sm" />
            <Skeleton className="h-4 w-12 rounded-sm" />
          </div>
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-8 w-16 rounded-sm" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-8 w-16 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
