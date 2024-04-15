import { Spritesheet, Texture, type SpritesheetFrameData } from "pixi.js";
import type { AnimationSheetData, AnimationFrameData } from "./types";

// This module creates an interface for parsing animation data 
// in a flexible variety of different formats/specifications
// and provides a helper function that can translate them to fit
// the specifications of the PIXI.js spritesheet API

//      TO IMPLEMENT:
//          pixel precise frames
//          mirrored frames
//          animation frame list aliases
//          sub sprites

function getPixiFrame(data: AnimationSheetData, frame: AnimationFrameData): SpritesheetFrameData {
    const [cw, ch] = data.meta.cellSize;
    return {
        ...frame,
        "frame": {
            x: cw * frame.position[0], 
            y: ch * frame.position[1], 
            w: cw, 
            h: ch
        }
    };
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