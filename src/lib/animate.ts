import { Application, Assets } from "pixi.js";

// load image textures
// async function loadAssets(assets: Array<String>) {

// }

export default {
    createApp: async (canvasElement: HTMLElement) => {
        const app = new Application();
        console.log(app);
        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#FF0000'
        });

        canvasElement.appendChild(app.canvas);

    }
}
