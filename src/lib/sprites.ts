import { Sprite, type SpriteOptions } from "pixi.js";
import type { AppContext, SpriteData } from "./types";


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

    return new Sprite({...data as SpriteOptions})
}