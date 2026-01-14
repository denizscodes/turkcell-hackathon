"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleService = void 0;
const common_1 = require("@nestjs/common");
const supabase_1 = require("../lib/supabase");
let RuleService = class RuleService {
    async create(createRuleDto) {
        const { data, error } = await supabase_1.supabase
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
    async findAll() {
        const { data, error } = await supabase_1.supabase
            .from("rules")
            .select("*")
            .order("priority", { ascending: false });
        if (error) {
            console.error("[v0] Error fetching rules:", error);
            return [];
        }
        return data || [];
    }
    async findById(id) {
        const { data, error } = await supabase_1.supabase
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
    async update(id, updateRuleDto) {
        const updateData = {
            updated_at: new Date().toISOString(),
        };
        if (updateRuleDto.name)
            updateData.name = updateRuleDto.name;
        if (updateRuleDto.eventType)
            updateData.event_type = updateRuleDto.eventType;
        if (updateRuleDto.conditions)
            updateData.conditions = updateRuleDto.conditions;
        if (updateRuleDto.actions)
            updateData.actions = updateRuleDto.actions;
        if (updateRuleDto.priority !== undefined)
            updateData.priority = updateRuleDto.priority;
        if (updateRuleDto.isActive !== undefined)
            updateData.is_active = updateRuleDto.isActive;
        const { data, error } = await supabase_1.supabase
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
    async delete(id) {
        const { data, error } = await supabase_1.supabase
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
    async evaluateEvent(eventData) {
        console.log("[v0] Evaluating event:", eventData);
        const { data: rules, error } = await supabase_1.supabase
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
    evaluateConditions(conditions, eventData) {
        if (!conditions || typeof conditions !== "object")
            return true;
        for (const [field, condition] of Object.entries(conditions)) {
            const fieldValue = this.getNestedValue(eventData.metadata, field);
            if (typeof condition === "object" && condition !== null) {
                for (const [operator, value] of Object.entries(condition)) {
                    switch (operator) {
                        case "$eq":
                        case "equals":
                            if (fieldValue !== value)
                                return false;
                            break;
                        case "$ne":
                        case "not_equals":
                            if (fieldValue === value)
                                return false;
                            break;
                        case "$gt":
                        case "greater_than":
                            if (!(fieldValue > value))
                                return false;
                            break;
                        case "$lt":
                        case "less_than":
                            if (!(fieldValue < value))
                                return false;
                            break;
                        case "$gte":
                            if (!(fieldValue >= value))
                                return false;
                            break;
                        case "$lte":
                            if (!(fieldValue <= value))
                                return false;
                            break;
                        case "$in":
                        case "in":
                            if (!Array.isArray(value) || !value.includes(fieldValue))
                                return false;
                            break;
                        case "contains":
                            if (!String(fieldValue).includes(value))
                                return false;
                            break;
                        default:
                            return false;
                    }
                }
            }
            else {
                if (fieldValue !== condition)
                    return false;
            }
        }
        return true;
    }
    getNestedValue(obj, path) {
        return path.split(".").reduce((current, key) => current?.[key], obj);
    }
    async getStats() {
        const { count: total } = await supabase_1.supabase
            .from("rules")
            .select("*", { count: "exact", head: true });
        const { count: active } = await supabase_1.supabase
            .from("rules")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);
        const { count: inactive } = await supabase_1.supabase
            .from("rules")
            .select("*", { count: "exact", head: true })
            .eq("is_active", false);
        const { data: topRules } = await supabase_1.supabase
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
};
exports.RuleService = RuleService;
exports.RuleService = RuleService = __decorate([
    (0, common_1.Injectable)()
], RuleService);
//# sourceMappingURL=rule.service.js.map