import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

export class Header{
    constructor(ctx, headUrl, arcX, arcY,arcR,animation=false) {

        let ds = DataStore.getInstance();
        this.img = wx.createImage();
        this.img.src = headUrl;

        this.arcX = arcX;
        this.arcY = arcY;
        this.arcR = arcR;


        let leftSpace = ds.get('leftSpace');
        let topSpace = ds.get('topSpace');
        let rate = ds.get('rate');
    }

    draw(){
        let ctx = DataStore.getInstance().ctx;
        let d =2 * this.arcR;
        let cx = this.arcX + this.arcR;
        let cy = this.arcY + this.arcR;
        ctx.arc(cx, cy, this.arcR, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.img, this.arcX, this.arcY, d, d);
        ctx.restore();
    }

    onLoaded(callback) {
        this.img.onload = () => {
            callback();
        }
    }
}