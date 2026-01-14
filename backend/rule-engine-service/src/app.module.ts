import { Module } from "@nestjs/common"
import { RuleModule } from "./rule/rule.module"
import { ConfigModule } from "./config/config.module"

@Module({
  imports: [ConfigModule, RuleModule],
})
export class AppModule {}
