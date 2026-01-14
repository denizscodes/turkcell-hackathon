// rule.service.ts
import { Injectable } from "@nestjs/common";
import { supabase } from "../lib/supabase";

// Tip hatasını çözmek için 'export' eklendi
export interface Rule {
  id?: string;
  name: string;
  event_type: string;
  conditions: any;
  actions: any;
  priority: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable()
export class RuleService {
  async create(createRuleDto: any): Promise<Rule> {
    const { data, error } = await supabase
      .from("rules")
      .insert({
        name: createRuleDto.name,
        event_type: createRuleDto.eventType,
        conditions: createRuleDto.conditions,
        actions: createRuleDto.actions,
        priority: createRuleDto.priority || 0,
        is_active: createRuleDto.isActive !== false,
      })
      .select()
      .single();

    if (error) {
      console.error("[v0] Error creating rule:", error);
      throw new Error(error.message);
    }

    return data;
  }

  async findAll(): Promise<Rule[]> {
    const { data, error } = await supabase
      .from("rules")
      .select("*")
      .order("priority", { ascending: false });

    if (error) {
      console.error("[v0] Error fetching rules:", error);
      return [];
    }

    return data || [];
  }

  async findById(id: string): Promise<Rule> {
    const { data, error } = await supabase
      .from("rules")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[v0] Error fetching rule:", error);
      throw new Error(error.message);
    }

    return data;
  }

  async update(id: string, updateRuleDto: any): Promise<Rule> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updateRuleDto.name) updateData.name = updateRuleDto.name;
    if (updateRuleDto.eventType)
      updateData.event_type = updateRuleDto.eventType;
    if (updateRuleDto.conditions)
      updateData.conditions = updateRuleDto.conditions;
    if (updateRuleDto.actions) updateData.actions = updateRuleDto.actions;
    if (updateRuleDto.priority !== undefined)
      updateData.priority = updateRuleDto.priority;
    if (updateRuleDto.isActive !== undefined)
      updateData.is_active = updateRuleDto.isActive;

    const { data, error } = await supabase
      .from("rules")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[v0] Error updating rule:", error);
      throw new Error(error.message);
    }

    return data;
  }

  async delete(id: string): Promise<Rule> {
    const { data, error } = await supabase
      .from("rules")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[v0] Error deleting rule:", error);
      throw new Error(error.message);
    }

    return data;
  }

  async evaluateEvent(eventData: any): Promise<any> {
    console.log("[v0] Evaluating event:", eventData);

    const { data: rules, error } = await supabase
      .from("rules")
      .select("*")
      .eq("event_type", eventData.eventType)
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (error) {
      console.error("[v0] Error fetching rules:", error);
      return { matchedRules: [], actions: [], evaluatedAt: new Date() };
    }

    const matchedRules = [];
    const actions = [];

    for (const rule of rules || []) {
      if (this.evaluateConditions(rule.conditions, eventData)) {
        matchedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
        });

        actions.push(...rule.actions);

        console.log("[v0] Rule matched:", rule.name);
      }
    }

    return {
      matchedRules,
      actions,
      evaluatedAt: new Date(),
    };
  }

  private evaluateConditions(conditions: any, eventData: any): boolean {
    if (!conditions || typeof conditions !== "object") return true;

    for (const [field, condition] of Object.entries(conditions)) {
      const fieldValue = this.getNestedValue(eventData.metadata, field);

      if (typeof condition === "object" && condition !== null) {
        for (const [operator, value] of Object.entries(condition)) {
          switch (operator) {
            case "$eq":
            case "equals":
              if (fieldValue !== value) return false;
              break;
            case "$ne":
            case "not_equals":
              if (fieldValue === value) return false;
              break;
            case "$gt":
            case "greater_than":
              if (!(fieldValue > value)) return false;
              break;
            case "$lt":
            case "less_than":
              if (!(fieldValue < value)) return false;
              break;
            case "$gte":
              if (!(fieldValue >= value)) return false;
              break;
            case "$lte":
              if (!(fieldValue <= value)) return false;
              break;
            case "$in":
            case "in":
              if (!Array.isArray(value) || !value.includes(fieldValue))
                return false;
              break;
            case "contains":
              if (!String(fieldValue).includes(value as string)) return false;
              break;
            default:
              return false;
          }
        }
      } else {
        if (fieldValue !== condition) return false;
      }
    }

    return true;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  async getStats() {
    const { count: total } = await supabase
      .from("rules")
      .select("*", { count: "exact", head: true });

    const { count: active } = await supabase
      .from("rules")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: inactive } = await supabase
      .from("rules")
      .select("*", { count: "exact", head: true })
      .eq("is_active", false);

    const { data: topRules } = await supabase
      .from("rules")
      .select("name, priority")
      .order("priority", { ascending: false })
      .limit(5);

    return {
      total: total || 0,
      active: active || 0,
      inactive: inactive || 0,
      topRules: topRules || [],
    };
  }
}
