import type { AppContext, EntityData, UpdateMethodData } from "./types";
import { createSprite } from "./sprites";
import { ImageGraphics } from "./components/graphics";

export class Entity {
    name: string;
    visible: boolean;
    paused: boolean;
    spawned: boolean;
    components: Map<string, {}>;
    updateMethods: Array<Function>;

    constructor(name: string) {
        this.name = name;

        this.visible = true;
        this.paused = false;
        this.spawned = false;

        this.components = new Map();
        this.updateMethods = [];
    }

    update() {
        if (!this.spawned) {
            this.spawned = true;
        }

        if (this.paused) return;

        this.updateMethods.forEach(method => {
            method();
        });
    }
}


function getUpdateMethod(entity: Entity, data: UpdateMethodData): Function {
    let obj: {} | undefined = entity;

    if (data.component) {
        obj = entity.components.get(data.component);

        if (!obj) throw Error(`Entity '${entity.name}' has no component '${data.component}'`);
    }

    // @ts-ignore
    const method: Function = obj[data.method];

    if (typeof method !== 'function') throw Error(`Component '${data.component} is not a method`);

    return () => method.bind(obj)(data);
}


export function createEntity(data: EntityData, ctx: AppContext) {
    const entity = new Entity(data?.name ?? '');

    if (data.sprite) {
        const graphics = new ImageGraphics(entity, createSprite(data.sprite, ctx));
        ctx.app.stage.addChild(graphics.sprite);
        entity.components.set(ImageGraphics.name, graphics);
    }

    if (data.updateMethods) {
        for (const methodData of data.updateMethods) {
            entity.updateMethods.push(getUpdateMethod(entity, methodData));
        }
    }

    ctx.app.ticker.add(() => entity.update());

    return entity;
}


