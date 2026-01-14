"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, Zap } from "lucide-react"
import { useCallback } from "react"
interface Event {
  _id: string
  userId: string
  eventType: string
  status: string
  timestamp: string
  matchedRules: any[]
  metadata?: any
}

export function EventStream() {
  const [events, setEvents] = useState<Event[]>([])

  async function fetchEvents() {
    try {
      const response = await fetch("http://localhost:3001/api/events")
      const data = await response.json()
      
      // Gelen verinin dizi olup olmadığını kontrol et
      if (Array.isArray(data)) {
        setEvents(data)
      } else {
        console.error("Events verisi dizi değil:", data)
        setEvents([]) // Hata gelirse boş dizi set et ki .map patlamasın
      }
    } catch (error) {
      console.error("[v0] Error fetching events:", error)
      setEvents([])
    }
  }

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Real-time Event Stream
          </CardTitle>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events yet. Start sending events to see them here.</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {event.eventType}
                      </Badge>
                      <StatusBadge status={event.status} />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-muted-foreground">{event.userId}</span>
                  </div>

                  {event.matchedRules?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Matched Rules:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.matchedRules.map((rule: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {rule.ruleName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.metadata && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View metadata
                        </summary>
                        <pre className="mt-2 p-2 bg-background rounded text-xs overflow-x-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    processed: { bg: "bg-accent/10", text: "text-accent", label: "Processed" },
    pending: { bg: "bg-yellow-500/10", text: "text-yellow-500", label: "Pending" },
    failed: { bg: "bg-destructive/10", text: "text-destructive", label: "Failed" },
  }

  const variant = variants[status] || variants.pending

  return (
    <Badge variant="outline" className={`${variant.bg} ${variant.text} border-transparent text-xs`}>
      {variant.label}
    </Badge>
  )
}
