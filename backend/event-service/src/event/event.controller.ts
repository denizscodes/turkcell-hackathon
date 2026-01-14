// event.controller.ts
import { Controller, Get, Post, Body } from "@nestjs/common";
import { EventService } from "./event.service";
import { Event } from "./event.dto";

@Controller("events") // "api/" eklendi
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 1. İstatistikler (Frontend bunu bekliyor)
  @Get("stats")
  async getStats() {
    return this.eventService.getStats();
  }

  // 2. Tüm Etkinlikleri Listele
  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  // 3. Yeni Etkinlik Oluştur
  @Post()
  async create(@Body() event: Event) {
    return this.eventService.create(event);
  }
}