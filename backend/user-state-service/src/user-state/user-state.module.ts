import { Module } from "@nestjs/common"
import { UserStateController } from "./user-state.controller"
import { UserStateService } from "./user-state.service"

@Module({
  controllers: [UserStateController],
  providers: [UserStateService],
})
export class UserStateModule {}
