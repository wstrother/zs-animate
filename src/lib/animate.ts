import { Application, Assets, Sprite, Texture } from "pixi.js";

type TextureHash = Record<string, Texture>;

// load image textures
async function loadAssets(assets: Record<string, string>): Promise<TextureHash> {
    
    for (const key in assets) {
        if (assets[key]) {
            const src = assets[key];
            Assets.add({alias: key, src: `/images/${src}`});
        }
    }

    const textures = await Assets.load(Object.keys(assets));

    return textures;
}


export default {
    createApp: async (canvasElement: HTMLElement, start: {images: Record<string, string>}) => {
        const app = new Application();

        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#FF0000'
        });

        canvasElement.appendChild(app.canvas);
        const textures: TextureHash = await loadAssets(start.images);

        for (const key in textures) {
            let sprite = Sprite.from(key);
            app.stage.addChild(sprite);
        };

    }
}
