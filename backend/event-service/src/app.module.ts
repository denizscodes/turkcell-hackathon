import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { EventModule } from "./event/event.module"

@Module({
  imports: [HttpModule, EventModule],
})
export class AppModule {}
