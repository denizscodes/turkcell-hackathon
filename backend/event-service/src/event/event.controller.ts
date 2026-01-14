// event.controller.ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { EventService } from "./event.service";
import { Event } from "./event.dto";
// event.controller.ts

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  // BU KISMI EKLE:
  @Get("stats") // Bu satır http://localhost:3002/events/stats yolunu açar
  getStats() {
    const allEvents = this.eventService.findAll();
    return {
      total: allEvents.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  create(@Body() event: Event) {
    return this.eventService.create(event);
  }
}
