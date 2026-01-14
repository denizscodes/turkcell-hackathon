import { Controller, Get, Post, Body } from "@nestjs/common"
import type { UserStateService } from "./user-state.service"

@Controller("user-state")
export class UserStateController {
  constructor(private readonly userStateService: UserStateService) {}

  @Get()
  findAll() {
    return this.userStateService.findAll()
  }

  @Get("stats")
  getStats() {
    return this.userStateService.getStats()
  }

  @Get(":userId")
  findByUserId(userId: string) {
    return this.userStateService.findByUserId(userId)
  }

  @Post('update')
  updateState(@Body() body: { userId: string; ruleResult: any }) {
    return this.userStateService.updateState(body.userId, body.ruleResult);
  }
}
