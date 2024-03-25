import { Application } from "pixi.js";

export default {
    createApp: async () => {
        const app = new Application();
        await app.init({ 
            width: 640, 
            height: 360,
            backgroundColor: '#FF0000'
        });

        document.body.appendChild(app.canvas);

    }
}
