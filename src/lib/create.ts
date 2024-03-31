import { Application, Assets, Texture, Spritesheet, type SpritesheetData, Container, Sprite, type SpriteOptions } from "pixi.js";
import type { AppContext, Manifest, SpriteData } from "./types";
import { createSprite } from "./sprites";


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

// instantiate starting sprites from manifest
function addSprites(sprites: Record<string, SpriteData>, {textures, spritesheets, stage}: AppContext): Record<string, Sprite> {
    const createdSprites: Record<string, Sprite> = {};
    for (const key in sprites) {
        try {
            const sprite = createSprite(sprites[key], {textures, spritesheets, stage});
            stage.addChild(sprite);
            createdSprites[key] = sprite;
        } catch (error) {
            console.log(`Error creating sprite '${key}':\n`, error);
        }
    }

    return createdSprites;
}


//  instantiates the PIXI application, loads resources specified by the manifest, 
//  and returns reference objects with key, value pairs for loaded resources and sprite sheets
//  also returns PIXI application's stage container
export default {
    createApp: async (canvasElement: HTMLElement, manifest: Manifest): Promise<{
        textures: Record<string, Texture>,
        spritesheets: Record<string, Spritesheet>,
        jsonFiles: Record<string, {}>,
        stage: Container,
        destroy: Function 
    }> => {
        const app = new Application();
        const stage = app.stage;
        const appOptions = manifest.init

        await app.init({ 
            resizeTo: canvasElement,
            ...appOptions
        });

        canvasElement.appendChild(app.canvas);
        const textures = await loadTextures(manifest.textures);
        // console.log(textures);

        const spritesheets = await loadSheets(textures, manifest.spritesheets);
        // console.log(spritesheets);

        const jsonFiles = await loadJSON(manifest.json);
        // console.log(jsonFiles);

        const sprites = addSprites(manifest.sprites, {textures, spritesheets, stage});
        // console.log(sprites);

        return {
            textures,
            spritesheets,
            jsonFiles,
            stage,
            destroy: () => {
                app.destroy({removeView: true});
            }
        }
    }
}
