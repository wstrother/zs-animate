import type { SpritesheetData } from "pixi.js"

export type Manifest = {
    textures: Record<string, string>,
    sheets: Record<string, SpritesheetData>,
    json: Record<string, string>
}