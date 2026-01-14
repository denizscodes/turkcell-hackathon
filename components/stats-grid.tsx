"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Users, CheckCircle } from "lucide-react";
import { useCallback } from "react";
interface Stats {
  totalEvents: number;
  processedEvents: number;
  activeRules: number;
  totalUsers: number;
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    processedEvents: 0,
    activeRules: 0,
    totalUsers: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      // 3 farklı fetch isteği aynı anda atılıyor
      const [eventStats, ruleStats, userStats] = await Promise.all([
        fetch("http://localhost:3001/api/events/stats").then((r) => r.json()),
        fetch("http://localhost:3002/api/rules/stats").then((r) => r.json()),
        fetch("http://localhost:3003/api/user-state/stats").then((r) =>
          r.json()
        ),
      ]);

      setStats({
        totalEvents: eventStats.total || 0,
        processedEvents: eventStats.processed || 0,
        activeRules: ruleStats.active || 0,
        totalUsers: userStats.totalUsers || 0,
      });
    } catch (error) {
      console.error("[v0] Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // 15 saniyede bir güncellensin
    return () => clearInterval(interval);
  }, [fetchStats]);

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Processed",
      value: stats.processedEvents,
      icon: CheckCircle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Active Rules",
      value: stats.activeRules,
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stat.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
