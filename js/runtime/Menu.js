import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore";

export class Menu extends Sprite {
    constructor(ctx, img, num=0, value=0) {
        let innerWidth = ctx.canvas.width;

        let startX = num * 150+10;
        let imgWidth = 130;
        let imgHeight = img.height;

        let backWidth = (innerWidth-20)/4;
        let backStartX = backWidth * num+10;

        let dataStore = DataStore.getInstance();

        let bottomY = dataStore.get('bottomY');
        let rate = dataStore.get('rate');

        super(ctx, img,
            startX,0,
            imgWidth,imgHeight,
            backStartX,bottomY+10,
            backWidth,imgHeight);

        this.value = value;
        // this.startX = startX;
        this.startY = bottomY+10;
        this.backStartX = backStartX;
        this.backWidth = backWidth;
        this.imgHeight = imgHeight;

    }

    draw(){
        super.draw();
        if (this.value == null) return;
        let ctx = DataStore.getInstance().ctx;
        ctx.fillStyle  = "#ff0000";
        ctx.font="Bold 15px April";
        ctx.fillText(this.value, this.backStartX+this.backWidth/2, this.startY+ this.imgHeight/2);
    }


}