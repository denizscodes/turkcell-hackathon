import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";

@Module({
  imports: [],
  controllers: [EventController], // Points to the class with @Controller()
  providers: [EventService], // Points to the class with @Injectable()
  exports: [EventService],
})
export class EventModule {}
