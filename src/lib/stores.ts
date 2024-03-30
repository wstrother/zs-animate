import type { Spritesheet, Texture } from "pixi.js";
import { writable, type Writable } from "svelte/store";

export const loadedJSON: Writable<Record<string, {}>> = writable({});
export const loadedTextures: Writable<Record<string, Texture>> = writable({});
export const loadedSpritesheets: Writable<Record<string, Spritesheet>> = writable({});
