import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { EventModule } from "./event/event.module"
import { ConfigModule } from "./config/config.module"

@Module({
  imports: [ConfigModule, HttpModule, EventModule],
})
export class AppModule {}
