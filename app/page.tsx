import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EventStream } from "@/components/event-stream"
import { StatsGrid } from "@/components/stats-grid"
import { RulesList } from "@/components/rules-list"
import { UserStateChart } from "@/components/user-state-chart"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Decision Engine Dashboard</h1>
          <p className="text-muted-foreground text-lg">Real-time event processing and rule management for Turkcell</p>
        </div>

        <Suspense fallback={<Skeleton className="h-32 w-full" />}>
          <StatsGrid />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <EventStream />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <UserStateChart />
            </Suspense>
          </div>
        </div>

        <div className="mt-8">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <RulesList />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
