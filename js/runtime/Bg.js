import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore";

export class Bg extends Sprite {
    constructor(ctx, img) {
        let innerWidth = ctx.canvas.width;
        let innerHeight = ctx.canvas.height;

        super(ctx, img,
            0,0,
            img.width,img.height,
            0,0,
            innerWidth,innerHeight);
    }

}