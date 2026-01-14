interface UserState {
    id?: string;
    user_id: string;
    state: any;
    last_event_type?: string;
    last_event_timestamp?: string;
    created_at?: string;
    updated_at?: string;
}
export declare class UserStateService {
    findAll(): Promise<UserState[]>;
    findByUserId(userId: string): Promise<UserState>;
    updateState(userId: string, ruleResult: any): Promise<UserState>;
    private determineNewState;
    getStats(): Promise<{
        totalUsers: number;
        stateDistribution: any[];
    }>;
}
export {};
