import { EventService } from "./event.service";
import { Event } from "./event.dto";
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    findAll(): Event[];
    create(event: Event): Event;
}
