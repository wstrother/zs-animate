import { ObservablePoint, Sprite } from "pixi.js";
import type { SpriteData } from "./types";

function setSpriteData(sprite: Sprite, data: SpriteData) { 
    // need to exclude any expected keys from sprite data
    // that do not refer to editable members of the Pixi sprite class
    const excludeKeys: Array<string> = ['texture', 'spritesheet'];

    for (const key in data) {
        if (sprite[key as keyof Sprite] instanceof ObservablePoint) {
            // infers keys that refer to points with x, y values 
            const [x, y] = data[key as keyof SpriteData] as [number, number];
            const point = sprite[key as keyof Sprite] as ObservablePoint;
            point.x = x;
            point.y = y;

        } else if (!excludeKeys.includes(key)) {
            // catch all asignment, to pass whatever sprite data can be
            // assigned directly from provided JSON
            // @ts-ignore       <-- suppress error for possible readonly members
            sprite[key as keyof Sprite] = data[key as keyof SpriteData]
        }
    }
}

export function createSprite(data: SpriteData): Sprite {
    const sprite = (() => {
        // create static sprite from single Texture
        if (data.texture) {
            return Sprite.from(data.texture)
        }
        // create dynamic sprite from Spritesheet
        //  TODO
    })();

    if (!sprite) throw Error('SpriteData provided could not be used');

    setSpriteData(sprite, data);

    return sprite;
}