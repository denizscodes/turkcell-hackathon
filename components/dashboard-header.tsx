import { Activity, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Turkcell Decision Engine</h1>
              <p className="text-sm text-muted-foreground">Microservice Architecture</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <ServiceStatus service="Event Service" port="3001" />
              <ServiceStatus service="Rule Engine" port="3002" />
              <ServiceStatus service="User State" port="3003" />
            </div>

            <Button variant="outline" size="sm">
              <Code2 className="w-4 h-4 mr-2" />
              API Docs
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

function ServiceStatus({ service, port }: { service: string; port: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md">
      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
      <span className="text-xs font-medium">{service}</span>
      <span className="text-xs text-muted-foreground">:{port}</span>
    </div>
  )
}
