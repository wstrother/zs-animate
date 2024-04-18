import { Spritesheet, Texture, type SpritesheetFrameData } from "pixi.js";
import type { AnimationSheetData, AnimationFrameData, RectData } from "./types";

// This module creates an interface for parsing animation data 
// in a flexible variety of different formats/specifications
// and provides a helper function that can translate them to fit
// the specifications of the PIXI.js spritesheet API

//      TO IMPLEMENT:
//          animation frame list aliases
//          sub sprites
//          arbitrary transforms
//              - offset
//              - scale
//              - rotation
//              - flip


function getRectFromCell(cellSize: [number, number], cellPos: [number, number]): RectData {
    const [w, h] = cellSize;
    const [cx, cy] = cellPos;

    return { x: w * cx, y: h * cy, w, h }
}


function getPixiFrame(data: AnimationSheetData, frameData: AnimationFrameData): SpritesheetFrameData {
    let rect: RectData;

    if (frameData.position) {
        rect = getRectFromCell(data.meta.cellSize, frameData.position);
    } else {
        rect = {
            x: frameData.x ?? 0,
            y: frameData.y ?? 0,
            w: frameData.w ?? 0,
            h: frameData.h ?? 0
        }
    }

    return {...frameData, frame: rect};
}

export function createSpritesheetData(texture: Texture, json: AnimationSheetData): Spritesheet {
    const frames: Record<string, SpritesheetFrameData> = {};
    const animations: Record<string, string[]> = {};

    json.animations.forEach(animation => {
        const pAnimation: string[] = [];

        animation.frames.forEach((frame, i) => {
            const pFrame: SpritesheetFrameData = getPixiFrame(json, frame);
            let fKey: string = `${animation.name}_${i}`;
            let newFrame: boolean = true;

            // use a unique key for any frames that don't result in the same object
            // including attached metadata.
            // NOTE: this comparison fails if the data isn't copy-pasted
            // because stringify isn't ordered
            for (const [key, value] of Object.entries(frames)) {
                if (JSON.stringify(value) === JSON.stringify(pFrame)) { 
                    fKey = key;
                    newFrame = false;
                }
            }
            if (newFrame) frames[fKey] = pFrame;
            pAnimation.push(fKey);
        });

        animations[animation.name] = pAnimation;
    });

    const meta = {
        scale: 1,
        ...json.meta
    }

    return new Spritesheet(texture, {
        frames,
        animations,
        meta
    });
}