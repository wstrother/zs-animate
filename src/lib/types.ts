import type { ApplicationOptions, Container, Spritesheet, SpritesheetData, Texture } from "pixi.js"

type PointData = [number, number] | {x: number, y: number}

export type SpriteData = {
    texture?: string | Texture,
    spritesheet?: string | Spritesheet,
    frame?: string,
    scale?: PointData,
    position?: PointData
}

export type EntityData = {
    name?: string,
    sprite: SpriteData
}

export type Manifest = {
    textures: Record<string, string>,
    spritesheets: Record<string, SpritesheetData>,
    json: Record<string, string>,
    entities: Record<string, EntityData>,
    init?: ApplicationOptions
}

export type AppContext = {
    stage: Container,
    textures: Record<string, Texture>,
    spritesheets: Record<string, Spritesheet>,
    jsonFiles?: Record<string, {}>
}