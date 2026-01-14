import { Event } from "./event.dto";
export declare class EventService {
    private events;
    create(event: Event): Event;
    findAll(): Event[];
}
