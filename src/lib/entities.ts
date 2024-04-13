import type { AppContext, EntityData, SpriteData, UpdateMethodData } from "./types";
import { createSprite } from "./sprites";
import { AnimationGraphics, ImageGraphics } from "./components/graphics";
import type { Sprite, Spritesheet } from "pixi.js";


// base entity container, stores components and manages update methods
export class Entity {
    name: string;
    paused: boolean;
    spawned: boolean;
    components: Map<string, {}>;
    updateMethods: Array<Function>;

    constructor(name: string) {
        this.name = name;

        this.paused = false;
        this.spawned = false;

        this.components = new Map();
        this.updateMethods = [];
    }

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




type SpriteGraphics = ImageGraphics|AnimationGraphics;

function getSpriteGraphics(entity: Entity, sprite: Sprite, data: SpriteData): SpriteGraphics {
    if (data.graphics === 'image' || data.graphics === undefined) {
        return new ImageGraphics(entity, sprite);

    } else if (data.graphics === 'animation') {
        const graphics = new AnimationGraphics(entity, sprite, data.spritesheet as Spritesheet);
        if (data.state) graphics.state = data.state;

        return graphics;

    } else {
        throw Error(`Could not generate sprite graphics for ${entity.name}`);
    }
}


export function createEntity(data: EntityData, ctx: AppContext) {
    const entity = new Entity(data?.name ?? '');

    if (data.sprite) {
        // generate graphics
        const sprite = createSprite(data.sprite, ctx);
        const graphics: SpriteGraphics = getSpriteGraphics(entity, sprite, data.sprite);

        // add to scene
        ctx.app.stage.addChild(graphics.sprite);
    }

    // add specified update methods
    for (const methodData of data.updateMethods ?? []) {
        entity.addUpdateMethod(methodData);
    }

    ctx.app.ticker.add(() => entity.update());

    return entity;
}


