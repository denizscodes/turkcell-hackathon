import { Module } from "@nestjs/common"
import { RuleModule } from "./rule/rule.module"

@Module({
  imports: [RuleModule],
})
export class AppModule {}
