import type { Entity } from "$lib/entities";
import { EntityComponent } from "$lib/entities";

type Listener = {
    event: string,
    method: Function
}

export class EventEmitter extends EntityComponent {
    listeners: Array<Listener>

    constructor(entity: Entity) {
        super(entity, "EventEmitter");
        this.listeners = [];
    }

    emit(name: string) {
        for (const listener of this.listeners) {
            if (listener.event === name) {
                listener.method();
            }
        }
    }

    // UPDATE METHODS
    
}