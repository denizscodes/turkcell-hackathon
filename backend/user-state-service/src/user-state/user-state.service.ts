import { Injectable } from "@nestjs/common"
import { supabase } from "../lib/supabase"

interface UserState {
  id?: string
  user_id: string
  state: any
  last_event_type?: string
  last_event_timestamp?: string
  created_at?: string
  updated_at?: string
}

@Injectable()
export class UserStateService {
  async findAll(): Promise<UserState[]> {
    const { data, error } = await supabase
      .from("user_states")
      .select("*")
      .order("last_event_timestamp", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching user states:", error)
      return []
    }

    return data || []
  }

  async findByUserId(userId: string): Promise<UserState> {
    const { data, error } = await supabase.from("user_states").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching user state:", error)
    }

    if (!data) {
      // Create new user state
      const { data: newState, error: createError } = await supabase
        .from("user_states")
        .insert({
          user_id: userId,
          state: {},
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Error creating user state:", createError)
        throw new Error(createError.message)
      }

      return newState
    }

    return data
  }

  async updateState(userId: string, ruleResult: any): Promise<UserState> {
    console.log("[v0] Updating user state for:", userId)

    const currentState = await this.findByUserId(userId)

    const newStateData = this.determineNewState(currentState, ruleResult)

    const { data, error } = await supabase
      .from("user_states")
      .update({
        state: newStateData,
        last_event_type: ruleResult.matchedRules?.[0]?.ruleName || null,
        last_event_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating user state:", error)
      throw new Error(error.message)
    }

    return data
  }

  private determineNewState(currentUserState: UserState, ruleResult: any): any {
    const currentState = currentUserState.state || {}
    const actions = ruleResult.actions || []

    let newState = { ...currentState }

    for (const action of actions) {
      if (action.type === "UPDATE_USER_STATE" && action.params) {
        newState = { ...newState, ...action.params }
      }
    }

    return newState
  }

  async getStats() {
    const { count: total } = await supabase.from("user_states").select("*", { count: "exact", head: true })

    return {
      totalUsers: total || 0,
      stateDistribution: [],
    }
  }
}
