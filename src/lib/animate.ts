import { Application, Assets, Texture, Spritesheet, type SpritesheetData } from "pixi.js";
import type { Manifest } from "./types";


// load image textures
async function loadTextures(textures: Record<string, string>): Promise<Record<string, Texture>> {
    
    for (const key in textures) {
        const src = textures[key];
        Assets.add({alias: key, src: `/images/${src}`});
    }

    return await Assets.load(Object.keys(textures));
}

// load JSON resources
async function loadJSON(jsonFiles: Record<string, string>): Promise<Record<string, {}>> {

    for (const key in jsonFiles) {
        const src = jsonFiles[key];
        Assets.add({alias: key, src: `/json/${src}`});
    }

    return await Assets.load(Object.keys(jsonFiles));
}

// parse sprite sheet data
async function loadSheets(textures: Record<string, Texture>, sheets: Record<string, SpritesheetData>) {
    const spriteSheets: Record<string, Spritesheet> = {}

    for (const key in sheets) {
        const meta = sheets[key].meta;
        if (meta.image) {
            const texture = textures[meta.image];
            const sheet = new Spritesheet(texture, sheets[key]);
            await sheet.parse();
            spriteSheets[key] = sheet;
        }
    }

    return spriteSheets;
}

//  instantiates the PIXI application, loads resources specified by the manifest, 
//  and returns reference objects with key, value pairs for loaded resources and sprite sheets
export default {
    createApp: async (canvasElement: HTMLElement, manifest: Manifest): Promise<{
        textures: Record<string, Texture>,
        spritesheets: Record<string, Spritesheet>,
        jsonFiles: Record<string, {}>
    }> => {
        const app = new Application();

        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#333333'
        });

        canvasElement.appendChild(app.canvas);
        const textures = await loadTextures(manifest.textures);
        // console.log(textures);

        const spritesheets = await loadSheets(textures, manifest.sheets);
        // console.log(spritesheets);

        const jsonFiles = await loadJSON(manifest.json);
        // console.log(jsonFiles);

        return {
            textures,
            spritesheets,
            jsonFiles
        }
    }
}
