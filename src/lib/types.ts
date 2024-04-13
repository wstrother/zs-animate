import type { Application, ApplicationOptions, Spritesheet, SpritesheetData, Texture } from "pixi.js"

type PointData = [number, number] | {x: number, y: number}

export type SpriteData = {
    texture?: string | Texture,
    spritesheet?: string | Spritesheet,
    frame?: string,
    scale?: PointData,
    position?: PointData
}

export type UpdateMethodData = {
    component?: string,
    method: string,
    [key:string]: string|number|boolean|undefined,
}

export type EntityData = {
    name?: string,
    sprite?: SpriteData,
    updateMethods?: Array<UpdateMethodData>
}

export type Manifest = {
    textures: Record<string, string>,
    spritesheets: Record<string, SpritesheetData>,
    json: Record<string, string>,
    entities: Record<string, EntityData>,
    init?: ApplicationOptions
}

export type AppContext = {
    app: Application,
    textures: Record<string, Texture>,
    spritesheets: Record<string, Spritesheet>,
    jsonFiles?: Record<string, {}>
}