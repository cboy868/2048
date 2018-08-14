import {Menu} from "./Menu.js";
import {DataStore} from "../base/DataStore";

export class Swap extends Menu{
    constructor(ctx, img) {
        let dataStore = DataStore.getInstance();
        const num = 1;

        let value = dataStore.get('propSwap');
        let active = value > 0 ? true : false;
        super(ctx, img, num, value, active);
        this.dataStore = dataStore;
        this.inSwap = false;
    }

    draw(){
        let value = this.dataStore.get('propSwap');
        super.draw(value);
        if (this.inSwap == true) {
            this.shadow();
        }
    }

    shadow(){
        // if (this.inSwap==true) return;
        let ctx = this.dataStore.ctx;
        ctx.save();
        ctx.fillStyle = "rgb(111,111,111)";
        ctx.globalAlpha = 0.7;
        let canvasWidth = this.dataStore.get('canvasWidth');
        let topY = this.dataStore.get('topSpace');
        ctx.beginPath();
        ctx.rect(10, topY, canvasWidth - 20, canvasWidth - 20);
        ctx.fill();
        ctx.restore();
        this.inSwap = true;
    }

    swapItemDraw() {
        let numberSprite = this.dataStore.get('numberSprite');
        let swapItems = numberSprite.swapItems;
        let ctx = this.dataStore.ctx;
        ctx.save();
        for (let item of swapItems) {
            let [x,y,width,height] = numberSprite.arr[item[0]][item[1]].getPosition();
            let r = 3;
            numberSprite.arr[item[0]][item[1]].draw();
            ctx.beginPath();
            ctx.arc(x+width-r-5,y+r+5,r,0,2*Math.PI,false);
            ctx.fillStyle="green";//填充颜色,默认是黑色
            ctx.fill();//画实心圆
            ctx.closePath();
        }
        ctx.restore();
    }

    update(){
        let value = this.dataStore.get('propSwap');
        if (value>0) {
            this.active = true;
        } else {
            this.active = false;
        }
    }

}