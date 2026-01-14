import { RuleService } from "./rule.service";
export declare class RuleController {
    private readonly ruleService;
    constructor(ruleService: RuleService);
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        topRules: {
            name: any;
            priority: any;
        }[];
    }>;
    findAll(): Promise<import("./rule.service").Rule[]>;
    create(createRuleDto: any): Promise<import("./rule.service").Rule>;
    findOne(id: string): Promise<import("./rule.service").Rule>;
    update(id: string, updateRuleDto: any): Promise<import("./rule.service").Rule>;
    delete(id: string): Promise<import("./rule.service").Rule>;
}
