import { Entity } from "$lib/entities";
import type { Sprite, Spritesheet, Texture } from "pixi.js";


export class Graphics {
    entity: Entity;
    name: string;

    constructor(entity: Entity) {
        this.entity = entity;
        this.name = Graphics.name;
        entity.components.set(this.name, this);
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


export class AnimationGraphics extends ImageGraphics {
    state: string;
    spritesheet: Spritesheet;
    animationCounter: number;

    constructor(entity: Entity, sprite: Sprite, spritesheet: Spritesheet) {
        super(entity, sprite);
        this.state = '';
        this.spritesheet = spritesheet;
        this.animationCounter = 0;

        entity.addUpdateMethod({component: this.name, method: this.updateAnimation.name});
    }

    get animation(): Array<Texture> {
        return this.spritesheet.animations[this.state] ?? [];
    }

    // UPDATE METHODS
    updateAnimation() {
        this.sprite.texture = this.animation[this.animationCounter];
        this.sprite.texture.source.scaleMode = 'nearest';

        this.animationCounter = (this.animationCounter + 1) % this.animation.length;
    }
}
