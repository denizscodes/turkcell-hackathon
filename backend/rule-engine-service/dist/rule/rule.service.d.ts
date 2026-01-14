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
export declare class RuleService {
    create(createRuleDto: any): Promise<Rule>;
    findAll(): Promise<Rule[]>;
    findById(id: string): Promise<Rule>;
    update(id: string, updateRuleDto: any): Promise<Rule>;
    delete(id: string): Promise<Rule>;
    evaluateEvent(eventData: any): Promise<any>;
    private evaluateConditions;
    private getNestedValue;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        topRules: {
            name: any;
            priority: any;
        }[];
    }>;
}
