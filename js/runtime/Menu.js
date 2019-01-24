import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore";

export class Menu extends Sprite {
    constructor(ctx, img, num = 0, value = 0, active = false) {
        let dataStore = DataStore.getInstance();
        let canvasWidth = dataStore.get('canvasWidth');
        let itemWidth = img.width / 4;
        let itemHeight = img.height / 2;
        let leftSpace = dataStore.get('leftSpace');
        let startX = num * itemWidth + leftSpace;
        let backItemWidth = (canvasWidth - leftSpace * 2) / 4;
        let backStartX = backItemWidth * num + leftSpace;

        let bottomY = dataStore.get('bottomY');
        let rate = dataStore.get('rate');

        // console.log(rate);

        dataStore.put('menuTopY', bottomY + 10);
        dataStore.put('menuBottomY', bottomY + 10 + itemHeight*rate);
        let startY = active ? itemHeight : 0;
        super(ctx, img,
            startX, startY,
            itemWidth, itemHeight,
            backStartX, bottomY + 10,
            backItemWidth, itemHeight*rate);

        this.active = active;
        this.startY = bottomY + 10;
        this.srcStartY = startY;
        this.backStartX = backStartX;
        this.itemHeight = itemHeight;
        this.rate = rate;
    }

    draw(value=0) {
        let ctx = DataStore.getInstance().ctx;
        if (this.active) {
            this.srcStartY = this.itemHeight;
            ctx.fillStyle = "#ff0000";
        } else {
            this.srcStartY=0;
            ctx.fillStyle = "#00ff00";
        }
        this.srcY = this.srcStartY;
        // this.setSrcY(this.srcStartY);
        super.draw();
        if (value == null || value==0 || value=='undefined') return;

        ctx.fillStyle = "#75a";
        ctx.font = "Bold 15px April";
        ctx.fillText(value, this.backStartX + 86*this.rate, this.startY + 40*this.rate);
    }


}