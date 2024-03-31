import { Application, Assets, Texture, Spritesheet, type SpritesheetData, Container, Sprite } from "pixi.js";
import type { Manifest, SpriteData } from "./types";


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
function createSprites(sprites: Record<string, SpriteData>, stage: Container) {
    for (const key in sprites) {
        const data = sprites[key];
        if (data.texture) {
            const sprite = Sprite.from(data.texture);
            if (data.scale) {
                sprite.scale.x = data.scale[0];
                sprite.scale.y = data.scale[1];
            }
            if (data.position) {
                sprite.x = data.position[0];
                sprite.y = data.position[1];
            }
            stage.addChild(sprite)
        }
    }
}


//  instantiates the PIXI application, loads resources specified by the manifest, 
//  and returns reference objects with key, value pairs for loaded resources and sprite sheets
//  also returns PIXI application's stage container
export default {
    createApp: async (canvasElement: HTMLElement, manifest: Manifest): Promise<{
        textures: Record<string, Texture>,
        spritesheets: Record<string, Spritesheet>,
        jsonFiles: Record<string, {}>,
        stage: Container
    }> => {
        const app = new Application();
        const stage = app.stage;

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

        createSprites(manifest.sprites, stage)

        return {
            textures,
            spritesheets,
            jsonFiles,
            stage,
        }
    }
}
