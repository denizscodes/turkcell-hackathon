"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStateService = void 0;
const common_1 = require("@nestjs/common");
const supabase_1 = require("../lib/supabase");
let UserStateService = class UserStateService {
    async findAll() {
        const { data, error } = await supabase_1.supabase
            .from("user_states")
            .select("*")
            .order("last_event_timestamp", { ascending: false });
        if (error) {
            console.error("[v0] Error fetching user states:", error);
            return [];
        }
        return data || [];
    }
    async findByUserId(userId) {
        const { data, error } = await supabase_1.supabase.from("user_states").select("*").eq("user_id", userId).single();
        if (error && error.code !== "PGRST116") {
            console.error("[v0] Error fetching user state:", error);
        }
        if (!data) {
            const { data: newState, error: createError } = await supabase_1.supabase
                .from("user_states")
                .insert({
                user_id: userId,
                state: {},
            })
                .select()
                .single();
            if (createError) {
                console.error("[v0] Error creating user state:", createError);
                throw new Error(createError.message);
            }
            return newState;
        }
        return data;
    }
    async updateState(userId, ruleResult) {
        console.log("[v0] Updating user state for:", userId);
        const currentState = await this.findByUserId(userId);
        const newStateData = this.determineNewState(currentState, ruleResult);
        const { data, error } = await supabase_1.supabase
            .from("user_states")
            .update({
            state: newStateData,
            last_event_type: ruleResult.matchedRules?.[0]?.ruleName || null,
            last_event_timestamp: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .eq("user_id", userId)
            .select()
            .single();
        if (error) {
            console.error("[v0] Error updating user state:", error);
            throw new Error(error.message);
        }
        return data;
    }
    determineNewState(currentUserState, ruleResult) {
        const currentState = currentUserState.state || {};
        const actions = ruleResult.actions || [];
        let newState = { ...currentState };
        for (const action of actions) {
            if (action.type === "UPDATE_USER_STATE" && action.params) {
                newState = { ...newState, ...action.params };
            }
        }
        return newState;
    }
    async getStats() {
        const { count: total } = await supabase_1.supabase.from("user_states").select("*", { count: "exact", head: true });
        return {
            totalUsers: total || 0,
            stateDistribution: [],
        };
    }
};
exports.UserStateService = UserStateService;
exports.UserStateService = UserStateService = __decorate([
    (0, common_1.Injectable)()
], UserStateService);
//# sourceMappingURL=user-state.service.js.map