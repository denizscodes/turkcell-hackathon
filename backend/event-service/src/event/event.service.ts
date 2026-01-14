import { Injectable } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"
import { supabase } from "../lib/supabase"

interface Event {
  id?: string
  user_id: string
  event_type: string
  event_data: any
  timestamp?: string
  processed?: boolean
  created_at?: string
}

@Injectable()
export class EventService {
  constructor(private readonly httpService: HttpService) {}

  async create(createEventDto: any): Promise<Event> {
    console.log("[v0] Creating new event:", createEventDto)

    const { data, error } = await supabase
      .from("events")
      .insert({
        user_id: createEventDto.userId,
        event_type: createEventDto.eventType,
        event_data: createEventDto.metadata || {},
        processed: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating event:", error)
      throw new Error(error.message)
    }

    // Send to Rule Engine for evaluation
    this.processEventWithRuleEngine(data)

    return data
  }

  async findAll(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100)

    if (error) {
      console.error("[v0] Error fetching events:", error)
      return []
    }

    return data || []
  }

  async findById(id: string): Promise<Event> {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching event:", error)
      throw new Error(error.message)
    }

    return data
  }

  async findByUserId(userId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching user events:", error)
      return []
    }

    return data || []
  }

  private async processEventWithRuleEngine(event: Event) {
    try {
      const ruleEngineUrl = process.env.RULE_ENGINE_URL || "http://localhost:3002"
      const response = await firstValueFrom(
        this.httpService.post(`${ruleEngineUrl}/api/rules/evaluate`, {
          userId: event.user_id,
          eventType: event.event_type,
          metadata: event.event_data,
          eventId: event.id,
        }),
      )

      console.log("[v0] Rule engine response:", response.data)

      await supabase
        .from("events")
        .update({
          processed: true,
        })
        .eq("id", event.id)

      // Send to User State Service
      if (response.data.matchedRules?.length > 0) {
        await this.updateUserState(event.user_id, response.data)
      }
    } catch (error) {
      console.error("[v0] Error processing event with rule engine:", error.message)
      await supabase.from("events").update({ processed: false }).eq("id", event.id)
    }
  }

  private async updateUserState(userId: string, ruleResult: any) {
    try {
      const userStateUrl = process.env.USER_STATE_URL || "http://localhost:3003"
      await firstValueFrom(
        this.httpService.post(`${userStateUrl}/api/user-state/update`, {
          userId,
          ruleResult,
        }),
      )
    } catch (error) {
      console.error("[v0] Error updating user state:", error.message)
    }
  }

  async getStats() {
    const { count: total } = await supabase.from("events").select("*", { count: "exact", head: true })

    const { count: processed } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("processed", true)

    const { count: pending } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("processed", false)

    return {
      total: total || 0,
      processed: processed || 0,
      pending: pending || 0,
      failed: 0,
    }
  }
}
