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



// base entity container, stores components and manages update methods
export class Entity {
    name: string;
    paused: boolean;
    spawned: boolean;
    components: Map<string, EntityComponent>;
    updateMethods: Array<Function>;
    container: Container | undefined;

    constructor(name: string) {
        this.name = name;

        this.paused = false;
        this.spawned = false;

        this.components = new Map();
        this.updateMethods = [];

        
    }

    // UPDATE METHODS

    update() {
        if (!this.spawned) {
            this.spawned = true;
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



