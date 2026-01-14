import { RuleService } from "./rule.service";
export declare class RuleController {
    private readonly ruleService;
    constructor(ruleService: RuleService);
    findAll(): Promise<import("./rule.service").Rule[]>;
}
