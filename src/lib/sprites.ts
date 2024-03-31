import { Sprite } from "pixi.js";
import type { SpriteData } from "./types";

function setSpriteData(sprite: Sprite, data: SpriteData) {
    if (data.scale) {
        sprite.scale.x = data.scale[0];
        sprite.scale.y = data.scale[1];
    }
    if (data.position) {
        sprite.x = data.position[0];
        sprite.y = data.position[1];
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