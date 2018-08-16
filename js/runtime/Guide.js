import {Helper} from "../lib/Helper";
import {DataStore} from "../base/DataStore";
import {Sprite} from "../base/Sprite";

export class Guide extends Sprite{
    constructor(ctx, img){
        super(ctx, img);
        this.startY = 70;
        this.beginY = 70;
        this.dataStore = DataStore.getInstance();
        this.isInsc = false;
        this.addListen();
    }

    /**
     * 玩法说明
     */
    insc(){
        let dataStore = DataStore.getInstance();
        let startX = 20;
        let startY = this.startY;
        let width = dataStore.get('canvasWidth') - 40;
        let lineHeight = 25;


        if (this.startY > 70) {
            startY = this.startY = 70;
        }

        if (this.startY < -570) {
            startY = this.startY = -570;
        }

        this.ctx.save();
        this.ctx.font = '16px sans-serif';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = "#333";


        let p1 = '1. 滑动手指，使所有数字方块向同一方向移动，可移动的方向为：上，下，左，右四个方向；';
        let p2 = '2. 两个邻近且相同的数字在移动时合并成他们的和，如 2 + 2 = 4,如下图；';
        let p3 = '3. 每次操作之后，会在空白的方格处随机生成一个数字2；';
        let p4 = '4. 16个格子全部填满，且没有可合并的格子，游戏结束；';

        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p1);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0,0,
            500,500,
            startX,startY,
            240,240
        );
        startY += 250;
        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p2);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0,0,
            500,500,
            startX,startY,
            240,240
        );
        startY += 250;
        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p3);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0,0,
            500,500,
            startX,startY,
            240,240
        );
        startY += 250;
        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p4);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0,0,
            500,500,
            startX,startY,
            240,240
        );

        let btn = this.dataStore.get('btnSprite');
        btn.single(3, 10,23, 100,40);

        this.ctx.restore();

    }


    addListen(){
        wx.onTouchMove(res=>{

            if (this.isInsc != true) return;

            let moveY = res.touches[0].clientY;
            let startY = this.dataStore.get('touchStartY');
            let step = moveY - startY;
            this.startY = this.beginY + step;
            if (this.moving == true) {
                return;
            }
            this.moving = true;
            this.dataStore.director.insc();
            this.moving = false;
        });

        wx.onTouchEnd(res=>{
            if (this.isInsc != true) return;
            this.beginY = this.startY;
            this.moving = false;
        });
    }

    skill(){

    }
}