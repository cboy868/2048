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
        dataStore.put('menuBottomY', bottomY + 10 + itemHeight);
        let startY = active ? itemHeight : 0;

        super(ctx, img,
            startX, startY,
            itemWidth, itemHeight,
            backStartX, bottomY + 10,
            backItemWidth, itemHeight*rate);

        this.active = active;
        this.value = value;
        this.startY = bottomY + 10;
        this.srcStartY = startY;
        this.backStartX = backStartX;
        this.backItemWidth = backItemWidth;
        this.itemHeight = itemHeight;


    }

    draw() {
        let ctx = DataStore.getInstance().ctx;
        if (this.active) {
            this.srcStartY = this.itemHeight;
            ctx.fillStyle = "#ff0000";
        } else {
            this.srcStartY=0;
            ctx.fillStyle = "#00ff00";
        }
        this.setSrcY(this.srcStartY);
        super.draw();
        if (this.value == null) return;

        ctx.fillStyle = "#ff0000";
        ctx.font = "Bold 15px April";



        console.log(this.active);

        ctx.fillText(this.value, this.backStartX + this.backItemWidth / 2, this.startY + this.itemHeight/2);
    }


}