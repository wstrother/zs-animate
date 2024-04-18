import type { Container, Spritesheet, Texture } from "pixi.js";
import { writable, type Writable } from "svelte/store";
import type { Entity } from "./entities";

export const loadedTextures: Writable<Record<string, Texture>> = writable({});
export const loadedSpritesheets: Writable<Record<string, Spritesheet>> = writable({});
export const appStage: Writable<Container|null> = writable(null);
export const loadedEntities: Writable<Array<Entity>> = writable([]);