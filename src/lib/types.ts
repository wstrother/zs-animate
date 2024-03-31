import type { SpritesheetData } from "pixi.js"

export type SpriteData = {
    texture?: string,
    scale?: [number, number],
    position?: [number, number]
}

export type Manifest = {
    textures: Record<string, string>,
    sheets: Record<string, SpritesheetData>,
    json: Record<string, string>,
    sprites: Record<string, {}>,
}