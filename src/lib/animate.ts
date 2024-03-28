import { Application, Assets } from "pixi.js";

// load image textures
async function loadAssets(assets: Array<String>) {
    // const textures = [];
    assets.forEach(async name => {
        await Assets.load(`images/${name}`);
    })
}

export default {
    createApp: async (canvasElement: HTMLElement) => {
        const app = new Application();
        loadAssets(['face.png']);

        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#FF0000'
        });

        canvasElement.appendChild(app.canvas);

    }
}
