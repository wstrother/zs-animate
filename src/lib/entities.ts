import type { Sprite } from "pixi.js";
import type { AppContext, EntityData } from "./types";
import { createSprite } from "./sprites";

export class Entity {
    name: string;
    visible: boolean;
    paused: boolean;
    spawned: boolean;

    constructor(name: string) {
        this.name = name;

        this.visible = true;
        this.paused = false;
        this.spawned = false;

        // this.layer = null;
        // this.group = null;
        // this._position = new Vector2(0, 0);

        // this.updateMethods = [];
        
        // this._components = [];
        // this._componentUpdates = new Map();

        // this.addComponent('events', new EventEmitter(this));
    }

    // addComponent(name, component, replace=false) {
    //     if (this[name] && !replace) {
    //         throw Error(`${this.name} already has a component called ${name}`);
    //     }
        
    //     this.removeComponent(name);
    //     this._components.push(name);
    //     this[name] = component;

    //     if (component['update']) {
    //         let method = (...args) => { component.update(...args); }

    //         this.updateMethods.push(method);
    //         this._componentUpdates.set(name, method);
    //     }
    // }

    // removeComponent(name) {
    //     if (this[name] && !this._components.includes(name)) {
    //         throw Error(`${this.name}.${name} is not a component`);
    //     }

    //     delete this[name];
    //     if (this._componentUpdates.has(name)) {
    //         let method = this._componentUpdates.get(name);
    //         this.updateMethods.pop(
    //             this.updateMethods.findIndex(m => m === method)
    //         );
    //         this._componentUpdates.delete(name);
    //     }
    // }

    // setVisible(bool: boolean) {
    //     this.visible = bool;
    // }

    // setPaused(bool) {
    //     this.paused = bool;
    // }

    // get position() {
    //     return this._position.coordinates;
    // }

    // setPosition(...position) {
    //     this._position.set(...position);
    // }

    // setLayer(layer) {
    //     this.layer = layer;
    //     layer.addEntity(this);
    // }

    // setGroup(group) {
    //     this.group = group;
    //     group.addEntity(this);
    // }

    // move(...args) {
    //     this._position.move(...args);
    // }

    update(...args: any[]) {
        if (!this.spawned) {
            this.spawned = true;
            // this.events.emit('spawn', this);
        }

        // this.updateMethods.forEach(method => {
        //     method(...args);
        // });
    }   
}


class Graphics {
    entity: Entity;

    constructor(entity: Entity) {
        this.entity = entity;
    }

    draw() {
        throw Error("Graphics is an abstract base class, draw() should be implemented by a sub class");
    }
}


export class ImageGraphics extends Graphics {
    sprite: Sprite

    constructor(entity: Entity, sprite: Sprite) {
        super(entity);
        this.sprite = sprite;
        // this.sprite.anchor.set(0.5, 0.5);
        // this.sprite.roundPixels = true;
    }

    // get width() {
    //     return this.sprite.width;
    // }

    // get height() {
    //     return this.sprite.height;
    // }

    // get size() {
    //     return [this.width, this.height]
    // }

    // scaleSprite(sprite, scaleX, scaleY) {
    //     sprite.setTransform(sprite.x, sprite.y, scaleX, scaleY);
    // }
    
    // setScale(scaleX, scaleY) {
    //     this.scaleSprite(this.sprite, scaleX, scaleY);
    // }

    // setMirror(mirrorX, mirrorY) {
    //     this.setScale(
    //         mirrorX ? -1 : 1,
    //         mirrorY ? -1 : 1
    //     );
    // }

    // setDrawPoint(sprite, [x, y]) {
    //     let [w, h] = [sprite.width, sprite.height];
    //     x += w / 2;
    //     y += h / 2;

    //     sprite.x = x;
    //     sprite.y = y;
    // }

    // drawSprite(container, sprite, position) {
    //     this.setDrawPoint(sprite, position);
    //     container.addChild(sprite);
    // }
    
    // draw(container) {
    //     this.drawSprite(container, this.sprite, this.entity.position);
    // }
}


export function createEntity(data: EntityData, ctx: AppContext) {
    const entity = new Entity(data?.name ?? '');
    const graphics = new ImageGraphics(entity, createSprite(data.sprite, ctx));
    ctx.stage.addChild(graphics.sprite);

    return entity;
}


