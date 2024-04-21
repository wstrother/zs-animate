import { Sprite, Spritesheet, type SpriteOptions } from "pixi.js";
import type { AppContext, EntityData, SpriteData } from "../types";
import { Entity } from "../entities";
import { ImageGraphics, AnimationGraphics } from "../components/graphics";
// import type { SpriteGraphics } from "./createEntities";

export type SpriteGraphics = ImageGraphics | AnimationGraphics;


export function createSprite(data: SpriteData, {textures, spritesheets}: AppContext): Sprite {
    // replace texture and spritesheet aliases
    if (data.texture && typeof data.texture === 'string') data.texture = textures[data.texture];
    
    if (data.spritesheet && typeof data.spritesheet === 'string') {
        data.spritesheet = spritesheets[data.spritesheet];
        data.texture = data.spritesheet.textures[data.frame ?? '']
    }

    // ensure all point data is consitent with Pixi's {x, y} structure
    const isPoint = (point: any): boolean => {
        if (!(point instanceof Array)) return false;
        if (!(point.length === 2)) return false;
        if (!(typeof point[0] === 'number' && typeof point[1] === 'number')) return false;
        return true;
    }
    for (const key of Object.keys(data)
        .filter(k => isPoint(data[k as keyof SpriteData]))
    ) {
        const point = data[key as keyof SpriteData]
        // @ts-ignore
        data[key] = {x: point[0], y: point[1]}
    }

    const sprite = new Sprite({...data as SpriteOptions});
    sprite.texture.source.scaleMode = 'nearest';
    return sprite;
}


export function getSpriteGraphics(entity: Entity, sprite: Sprite, data: SpriteData): SpriteGraphics {
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

