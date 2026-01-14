"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const supabase_1 = require("../lib/supabase");
let EventService = class EventService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async create(createEventDto) {
        console.log("[v0] Creating new event:", createEventDto);
        const { data, error } = await supabase_1.supabase
            .from("events")
            .insert({
            user_id: createEventDto.userId,
            event_type: createEventDto.eventType,
            event_data: createEventDto.metadata || {},
            processed: false,
        })
            .select()
            .single();
        if (error) {
            console.error("[v0] Error creating event:", error);
            throw new Error(error.message);
        }
        this.processEventWithRuleEngine(data);
        return data;
    }
    async findAll() {
        const { data, error } = await supabase_1.supabase
            .from("events")
            .select("*")
            .order("timestamp", { ascending: false })
            .limit(100);
        if (error) {
            console.error("[v0] Error fetching events:", error);
            return [];
        }
        return data || [];
    }
    async findById(id) {
        const { data, error } = await supabase_1.supabase.from("events").select("*").eq("id", id).single();
        if (error) {
            console.error("[v0] Error fetching event:", error);
            throw new Error(error.message);
        }
        return data;
    }
    async findByUserId(userId) {
        const { data, error } = await supabase_1.supabase
            .from("events")
            .select("*")
            .eq("user_id", userId)
            .order("timestamp", { ascending: false });
        if (error) {
            console.error("[v0] Error fetching user events:", error);
            return [];
        }
        return data || [];
    }
    async processEventWithRuleEngine(event) {
        try {
            const ruleEngineUrl = this.configService.ruleEngineUrl;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${ruleEngineUrl}/api/rules/evaluate`, {
                userId: event.user_id,
                eventType: event.event_type,
                metadata: event.event_data,
                eventId: event.id,
            }));
            console.log("[v0] Rule engine response:", response.data);
            await supabase_1.supabase
                .from("events")
                .update({
                processed: true,
            })
                .eq("id", event.id);
            if (response.data.matchedRules?.length > 0) {
                await this.updateUserState(event.user_id, response.data);
            }
        }
        catch (error) {
            console.error("[v0] Error processing event with rule engine:", error.message);
            await supabase_1.supabase.from("events").update({ processed: false }).eq("id", event.id);
        }
    }
    async updateUserState(userId, ruleResult) {
        try {
            const userStateUrl = this.configService.userStateUrl;
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${userStateUrl}/api/user-state/update`, {
                userId,
                ruleResult,
            }));
        }
        catch (error) {
            console.error("[v0] Error updating user state:", error.message);
        }
    }
    async getStats() {
        const { count: total } = await supabase_1.supabase.from("events").select("*", { count: "exact", head: true });
        const { count: processed } = await supabase_1.supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("processed", true);
        const { count: pending } = await supabase_1.supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("processed", false);
        return {
            total: total || 0,
            processed: processed || 0,
            pending: pending || 0,
            failed: 0,
        };
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function])
], EventService);
//# sourceMappingURL=event.service.js.map