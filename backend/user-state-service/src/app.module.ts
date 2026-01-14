import { Module } from "@nestjs/common"
import { UserStateModule } from "./user-state/user-state.module"
import { ConfigModule } from "./config/config.module"

@Module({
  imports: [ConfigModule, UserStateModule],
})
export class AppModule {}
