// event.controller.ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { EventService } from "./event.service";
import { Event } from "./event.dto";

@Controller("events") // This decorator is REQUIRED
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Post()
  create(@Body() event: Event) {
    return this.eventService.create(event);
  }
}
