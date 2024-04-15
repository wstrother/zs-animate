import { Spritesheet, Texture, type SpritesheetFrameData } from "pixi.js";
import type { AnimationSheetData, AnimationFrameData } from "./types";

// This module creates an interface for parsing animation data 
// in a flexible variety of different formats/specifications
// and provides a helper function that can translate them to fit
// the specifications of the PIXI.js spritesheet API

function getPixiFrame(data: AnimationSheetData, frame: AnimationFrameData): SpritesheetFrameData {
    const [cw, ch] = data.meta.cellSize;

    return {
        frame: {
            x: cw * frame.position[0], 
            y: ch * frame.position[1], 
            w: cw, 
            h: ch
        }
    }
}

export function createSpritesheetData(texture: Texture, json: AnimationSheetData): Spritesheet {
    const frames: Record<string, SpritesheetFrameData> = {};
    const animations: Record<string, string[]> = {};

    json.animations.forEach(animation => {
        const pAnimation: string[] = [];

        animation.frames.forEach(frame => {
            const pFrame: SpritesheetFrameData = getPixiFrame(json, frame);
            const fKey: string = JSON.stringify(pFrame);
            frames[fKey] = pFrame;
            pAnimation.push(fKey);
        });

        animations[animation.name] = pAnimation;
    });

    return new Spritesheet(texture, {
        frames,
        animations,
        meta: {scale: 1}
    });
}