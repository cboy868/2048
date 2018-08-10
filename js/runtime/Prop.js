import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

/**
 * 道具
 */
export class Prop extends Sprite {
    constructor(ctx, img, startX, startY, value) {
        let dataStore = DataStore.getInstance();
        let rate = dataStore.get('rate');


        // let backgroundSprite = dataStore.get('background');
        // let rate = backgroundSprite.rate;

        super(ctx, img,
            0,0,
            img.width,img.height,
            startX,startY,
            img.width*rate,img.height*rate);

        this.value = value;
        this.ctx = ctx;
        this.startX = startX;
        this.startY = startY;
        this.dataStore = dataStore;
    }

    draw(){
        super.draw();
        if (this.value == null) return;

        let ctx = this.dataStore.ctx;
        ctx.fillStyle  = "#ff0000";
        ctx.font="Bold 15px April";
        ctx.fillText(this.value, this.startX+10, this.startY+10);
    }

}