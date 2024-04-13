import { Application, Assets, Texture, Spritesheet, type SpritesheetData, Container, Sprite, type SpriteOptions } from "pixi.js";
import type { AppContext, EntityData, Manifest } from "./types";
import { createEntity, type Entity } from "./entities";


// load image textures
async function loadTextures(textures: Record<string, string>): Promise<Record<string, Texture>> {
    
    for (const key in textures) {
        const src = textures[key];
        Assets.add({alias: key, src: `/images/${src}`});
    }

    return await Assets.load(Object.keys(textures));
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
function addEntities(entities: Record<string, EntityData>, {textures, spritesheets, stage}: AppContext): Record<string, Entity> {
    const createdEntities: Record<string, Entity> = {};
    for (const key in entities) {
        try {
            if (!entities[key].name) entities[key].name = key;
            const entity = createEntity(entities[key], {textures, spritesheets, stage});
            createdEntities[key] = entity;
        } catch (error) {
            console.log(`Error creating entity '${key}':\n`, error);
        }
    }

    return createdEntities;
}


//  instantiates the PIXI application, loads resources specified by the manifest, 
//  and returns reference objects with key, value pairs for loaded resources and sprite sheets
//  also returns PIXI application's stage container
export default {
    createApp: async (canvasElement: HTMLElement, manifest: Manifest): Promise<{
        textures: Record<string, Texture>,
        spritesheets: Record<string, Spritesheet>,
        app: Application,
        destroy: Function,
        start: Function,
        stop: Function,
        update: Function
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

        const sprites = addEntities(manifest.entities, {textures, spritesheets, stage});
        // console.log(sprites);

        // app.ticker.add(() => {
        //     for (const sprite in sprites) {
        //         sprites[sprite].rotation += 0.02;
        //     }
        // })

        return {
            textures,
            spritesheets,
            app,
            destroy: () => {
                app.destroy({removeView: true});
            },
            start: () => {
                app.ticker.start();
            },
            stop: () => {
                app.ticker.stop();
            },
            update: () => {
                app.ticker.update();
            }
        }
    }
}
