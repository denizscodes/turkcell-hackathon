"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface StateDistribution {
  state: string
  count: number
}

const COLORS = ["hsl(250, 100%, 65%)", "hsl(173, 80%, 50%)", "hsl(45, 100%, 60%)", "hsl(0, 84%, 60%)"]

export function UserStateChart() {
  const [data, setData] = useState<StateDistribution[]>([])

  useEffect(() => {
    fetchUserStates()
    const interval = setInterval(fetchUserStates, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchUserStates() {
    try {
      const response = await fetch("http://localhost:3003/api/user-state/stats")
      const stats = await response.json()
      setData(stats.stateDistribution || [])
    } catch (error) {
      console.error("[v0] Error fetching user states:", error)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          User State Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No user data available</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={{
              count: {
                label: "Users",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ state, percent }) => `${state}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={item.state} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="font-medium">{item.state}</span>
              </div>
              <span className="text-muted-foreground">{item.count} users</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
