import { Module } from "@nestjs/common"
import { UserStateModule } from "./user-state/user-state.module"

@Module({
  imports: [UserStateModule],
})
export class AppModule {}
