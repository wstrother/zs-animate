import { Application } from "pixi.js";

export default {
    createApp: async (canvasElement: HTMLElement) => {
        const app = new Application();
        await app.init({ 
            resizeTo: canvasElement,
            backgroundColor: '#FF0000'
        });

        canvasElement.appendChild(app.canvas);

    }
}
