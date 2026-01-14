export declare class ConfigService {
    private config;
    constructor();
    get supabaseUrl(): string;
    get supabaseServiceRoleKey(): string;
    get ruleEngineUrl(): string;
    get userStateUrl(): string;
    get port(): number;
}
