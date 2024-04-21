import type { Entity } from "$lib/entities";
import { EntityComponent } from "$lib/entities";

type Listener = {
    event: string,
    method: Function
}

export class EventEmitter extends EntityComponent {
    listeners: Array<Listener>;
    spawned: boolean = false;

    constructor(entity: Entity) {
        super(entity, "EventEmitter");
        this.listeners = [];

        entity.updateMethods.push(() => {
            if (!this.spawned) {
                this.spawned = true;
                this.emit('spawn');
            }
        })
    }

    emit(event: string) {
        for (const listener of this.listeners) {
            if (listener.event === event) {
                listener.method();
            }
        }
    }

    addListener(event: string, method: Function) {
        this.listeners.push({event, method});
    }

    // UPDATE METHODS
    
}