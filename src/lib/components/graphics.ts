import { Entity } from "$lib/entities";
import type { Sprite } from "pixi.js";


export class Graphics {
    entity: Entity;

    constructor(entity: Entity) {
        this.entity = entity;
    }
}


export class ImageGraphics extends Graphics {
    sprite: Sprite;

    constructor(entity: Entity, sprite: Sprite) {
        super(entity);
        this.sprite = sprite;
    }

    // UPDATE METHODS
    rotateSprite({angle}: {angle: number}) {
        this.sprite.rotation += angle;
    }
}

