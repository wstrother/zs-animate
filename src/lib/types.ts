import type { Application, ApplicationOptions, Container, Spritesheet, Texture } from "pixi.js"


// GENERAL DATA TYPES
export type PointData = [number, number] | {x: number, y: number}
export type RectData = {x: number, y: number, w: number, h: number}

// ANIMATION DATA TYPES
export type AnimationFrameData = {
    position?: [number, number],
    x?: number,
    y?: number,
    w?: number,
    h?: number
}
export type AnimationData = {
    name: string,
    frames: Array<AnimationFrameData>
}
export type AnimationSheetData = {
    meta: {
        cellSize: [number, number],
        image: string
    }
    animations: Array<AnimationData>
}
export type SpriteData = {
    texture?: string | Texture,
    spritesheet?: string | Spritesheet,
    frame?: string,
    scale?: PointData,
    position?: PointData,
    graphics?: 'animation'|'image',
    state?: string
}

// ENTITY DATA TYPES
export type UpdateMethodData = {
    component?: string,
    method: string,
    [key:string]: string|number|boolean|undefined,
}
export type EntityData = {
    name?: string,
    sprite?: SpriteData,
    updateMethods?: Array<UpdateMethodData>,
    container?: string,
}

// MANIFEST DATA / APP CONTEXT
export type Manifest = {
    textures: Record<string, string>,
    spritesheets: Record<string, AnimationSheetData>,
    json: Record<string, string>,
    entities: Record<string, EntityData>,
    init?: ApplicationOptions
}
export type AppContext = {
    app: Application,
    textures: Record<string, Texture>,
    spritesheets: Record<string, Spritesheet>,
    jsonFiles?: Record<string, {}>,
    containers: Record<string, Container>,
}
