import { Application, Assets, Sprite, Texture } from "pixi.js";

type TextureHash = Record<string, Texture>;

// load image textures
async function loadTextures(textures: Record<string, string>): Promise<TextureHash> {
    
    for (const key in textures) {
        if (textures[key]) {
            const src = textures[key];
            Assets.add({alias: key, src: `/images/${src}`});
        }
    }

    return await Assets.load(Object.keys(textures));
}


export default {
    createApp: async (canvasElement: HTMLElement, start: {textures: Record<string, string>}) => {
        const app = new Application();

        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#FF0000'
        });

        canvasElement.appendChild(app.canvas);
        const textures: TextureHash = await loadTextures(start.textures);
        console.log(textures);

        for (const key in textures) {
            let sprite = Sprite.from(key);
            app.stage.addChild(sprite);
        };

    }
}
