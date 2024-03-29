import { Application, Assets, Sprite, Texture, Spritesheet, type SpritesheetData } from "pixi.js";
import type { Manifest } from "./types";

type TextureHash = Record<string, Texture>;

// load image textures
async function loadTextures(textures: Record<string, string>): Promise<TextureHash> {
    
    for (const key in textures) {
        const src = textures[key];
        Assets.add({alias: key, src: `/images/${src}`});
    }

    return await Assets.load(Object.keys(textures));
}

// parse sprite sheet data
async function loadSheets(textures: TextureHash, sheets: Array<SpritesheetData>) {

    for (const key in sheets) {
        const meta = sheets[key].meta;
        if (meta.image) {
            const texture = textures[meta.image];
            const sheet = new Spritesheet(texture, sheets[key]);
            await sheet.parse()
        }
    }
}


export default {
    createApp: async (canvasElement: HTMLElement, start: Manifest) => {
        const app = new Application();

        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#333333'
        });

        canvasElement.appendChild(app.canvas);
        const textures: TextureHash = await loadTextures(start.textures);
        console.log(textures);

        await loadSheets(textures, start.sheets)
    }
}
