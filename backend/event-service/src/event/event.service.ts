// event.service.ts
import { Injectable } from "@nestjs/common";
import { Event } from "./event.dto";

@Injectable()
export class EventService {
  private events: Event[] = [];

  create(event: Event) {
    this.events.push(event);
    return event;
  }

  findAll() {
    return this.events;
  }
}
