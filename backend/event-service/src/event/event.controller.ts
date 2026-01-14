import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import type { EventService } from "./event.service"

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: any) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll()
  }

  @Get("stats")
  getStats() {
    return this.eventService.getStats()
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.eventService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findById(id);
  }
}
