import { Entity } from "$lib/entities";


export class EntityComponent {
    entity: Entity;
    name: string;

    constructor(entity: Entity, name: string) {
        this.entity = entity;
        this.name = name;
        entity.components.set(this.name, this);
    }
}
