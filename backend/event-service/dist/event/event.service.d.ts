import type { HttpService } from "@nestjs/axios";
import type { ConfigService } from "../config/config.service";
interface Event {
    id?: string;
    user_id: string;
    event_type: string;
    event_data: any;
    timestamp?: string;
    processed?: boolean;
    created_at?: string;
}
export declare class EventService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    create(createEventDto: any): Promise<Event>;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event>;
    findByUserId(userId: string): Promise<Event[]>;
    private processEventWithRuleEngine;
    private updateUserState;
    getStats(): Promise<{
        total: number;
        processed: number;
        pending: number;
        failed: number;
    }>;
}
export {};
