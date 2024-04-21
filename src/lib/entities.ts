import type { UpdateMethodData } from "./types";
import type { Container } from "pixi.js";


// base component of an entity instance
export class EntityComponent {
    entity: Entity;
    name: string;

    constructor(entity: Entity, name: string) {
        this.entity = entity;
        this.name = name;
        entity.components.set(this.name, this);
    }
}

// event types
type Listener = {
    event: string,
    method: Function
}

// base entity container, stores components and manages update methods
export class Entity {
    name: string;
    paused: boolean = false;
    components: Map<string, EntityComponent> = new Map();
    updateMethods: Array<Function> = [];
    container: Container | undefined;

    listeners: Array<Listener> = [];
    spawned: boolean = false;

    constructor(name: string) {
        this.name = name;
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

    update() {
        if (!this.spawned) {
            this.spawned = true;
            this.emit('spawn');
        }
        
        if (this.paused) return;

        this.updateMethods.forEach(method => {
            method();
        });
    }

    addUpdateMethod(data: UpdateMethodData) {
        let obj: {} | undefined = this;
    
        if (data.component) {
            obj = this.components.get(data.component);
    
            if (!obj) throw Error(`Entity '${this.name}' has no component '${data.component}'`);
        }
    
        // @ts-ignore
        const method: Function = obj[data.method];
    
        if (typeof method !== 'function') throw Error(`Component '${data.component} is not a method`);
    
        this.updateMethods.push(
            () => method.bind(obj)(data)
        );
    }
}



