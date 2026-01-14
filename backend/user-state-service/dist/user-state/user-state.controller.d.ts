import { UserStateService } from "./user-state.service";
export declare class UserStateController {
    private readonly userStateService;
    constructor(userStateService: UserStateService);
    findAll(): Promise<any>;
    getStats(): Promise<any>;
    findByUserId(userId: string): Promise<any>;
    updateState(body: {
        userId: string;
        ruleResult: any;
    }): Promise<any>;
}
