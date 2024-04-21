import { Entity } from "$lib/entities";
import type { RectData } from "$lib/types";
import { EntityComponent } from "$lib/entities";
import type { Container, Sprite, Spritesheet, SpritesheetFrameData, Texture } from "pixi.js";


export class RectGraphics extends EntityComponent {
    rects: RectData[];

    constructor(entity: Entity) {
        super(entity, "RectGraphics");
        this.rects = [];
    }

}


export class ImageGraphics extends EntityComponent {
    sprite: Sprite;

    constructor(entity: Entity, sprite: Sprite) {
        super(entity, "Graphics");
        this.sprite = sprite;
    }

    addToScene(container: Container) {
        container.addChild(this.sprite);
    }

    removeFromScene(container: Container) {
        container.removeChild(this.sprite);
    }

    // UPDATE METHODS
    // rotateSprite({angle}: {angle: number}) {
    //     this.sprite.rotation += angle;
    // }
}


export class AnimationGraphics extends ImageGraphics {
    state: string;
    spritesheet: Spritesheet;
    animationCounter: number;
    frameCounter: number;

    constructor(entity: Entity, sprite: Sprite, spritesheet: Spritesheet) {
        super(entity, sprite);
        this.state = '';
        this.spritesheet = spritesheet;
        this.animationCounter = 0;
        this.frameCounter = 0;

        entity.updateMethods.push(() => this.updateAnimation());
    }

    get states(): Array<string> {
        return Object.keys(this.spritesheet.animations);
    }

    get animationIndex(): number {
        return Math.floor(this.animationCounter);
    }

    get animation(): Array<Texture> {
        return this.spritesheet.animations[this.state] ?? [];
    }

    get animationData(): SpritesheetFrameData[] {
        const keyArray = (this.spritesheet.data.animations ?? {})[this.state] ?? [];
        
        return keyArray.map(key => this.spritesheet.data.frames[key]);
    }

    get frameData(): any {
        return {
            ...this.spritesheet.data.meta,
            ...this.animationData[this.animationIndex],
        }
    }

    get frameLength(): number {
        return this.frameData?.frameLength ?? 1
    }

    setState(state: string) {
        this.state = state;
        this.resetCounter();
    }

    resetCounter() {
        this.frameCounter = 0;
        this.animationCounter = 0;
    }

    // UPDATE METHODS
    updateAnimation() {
        this.sprite.texture = this.animation[this.animationIndex];
        this.sprite.texture.source.scaleMode = 'nearest';

        if (this.frameCounter < this.frameLength - 1) this.frameCounter++; 
        else {
            this.animationCounter = (this.animationCounter + 1) % this.animation.length;
            this.frameCounter = 0;
        }

    }
}
