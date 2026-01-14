import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UserStateService } from "./user-state.service";

@Controller("user-state")
export class UserStateController {
  constructor(private readonly userStateService: UserStateService) {}

  @Get()
  // Dönüş tipini 'any' veya servisteki gerçek tip neyse ona zorla
  findAll(): Promise<any> {
    return this.userStateService.findAll();
  }

  @Get("stats")
  getStats(): Promise<any> {
    return this.userStateService.getStats();
  }

  @Get(":userId")
  findByUserId(@Param("userId") userId: string): Promise<any> {
    return this.userStateService.findByUserId(userId);
  }

  @Post("update")
  updateState(@Body() body: { userId: string; ruleResult: any }): Promise<any> {
    return this.userStateService.updateState(body.userId, body.ruleResult);
  }
}
