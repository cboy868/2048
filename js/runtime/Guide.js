import {Helper} from "../lib/Helper";
import {DataStore} from "../base/DataStore";
import {Sprite} from "../base/Sprite";

export class Guide extends Sprite {
    constructor(ctx, img) {
        super(ctx, img);
        this.startY = 70;
        this.beginY = 70;
        this.dataStore = DataStore.getInstance();
        this.moveAction = 'moveRight';
        this.skillStep = 0;
        this.isSkill = false;
        this.speed = 3;
        this.slideStartY = 0;
        this.slideStartX = 0;
        this.timestamp = 0;
        // this.addListen();
    }

    /**
     * 玩法说明
     */
    insc(startY) {
        let dataStore = DataStore.getInstance();
        let startX = 20;
        // let startY = this.startY;
        let width = dataStore.get('canvasWidth') - 40;
        let lineHeight = 25;

        if (this.startY > 70) {
            startY = this.startY = 70;
        }

        if (this.startY < -570) {
            startY = this.startY = -570;
        }


        // let marginTop = 80;
        // let marginLeft = 20;
        //
        // let offCanvas = wx.createCanvas();
        // let offCtx = offCanvas.getContext('2d');
        //
        //
        // //
        // offCtx.clearRect(marginLeft, marginTop, this.dataStore.get("canvasWidth") - marginLeft*2, this.dataStore.get("canvasHeight") - marginTop*2);
        // offCtx.fillStyle = '#302F30';
        // offCtx.fillRect(marginLeft, marginTop, this.dataStore.get("canvasWidth") - marginLeft*2, this.dataStore.get("canvasHeight") - marginTop*2);
        //
        //
        // offCtx.font = '16px sans-serif';
        // offCtx.textBaseline = 'top';
        // offCtx.fillStyle = "#fff";
        // let p1 = '1. 滑动手指，使所有数字方块向同一方向移动，可移动的方向为：上，下，左，右四个方向；';
        //
        //
        // Helper.wrapText(offCtx, startX, startY, width, lineHeight, p1);
        // startY += 50;
        // offCtx.drawImage(
        //     this.img,
        //     0, 0,
        //     500, 500,
        //     startX, startY,
        //     240, 240
        // );
        //
        //
        //
        //
        //
        //
        //
        //
        // let returnImage = wx.createImage();
        // returnImage.src = 'images/return.png';
        // returnImage.onload = () => {
        //     offCtx.drawImage(returnImage, marginLeft+30, this.dataStore.get("canvasHeight")-marginTop-50, 50, 50);
        //
        //     // offCtx.save();//保存状态
        //     // offCtx.translate(0, 0);
        //     // offCtx.rotate(-Math.PI );
        //     // offCtx.drawImage(returnImage,  -this.dataStore.get('canvasWidth') + marginLeft, marginTop-this.dataStore.get("canvasHeight"), 50, 50);
        //     // offCtx.restore();//恢复状态
        // };
        //
        //
        //
        // this.ctx.drawImage(offCanvas, 0, 0, this.dataStore.get("canvasWidth"), this.dataStore.get("canvasHeight"));
        //
        // return;


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
            0, 0,
            500, 500,
            startX, startY,
            240, 240
        );
        startY += 250;
        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p2);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0, 0,
            500, 500,
            startX, startY,
            240, 240
        );
        startY += 250;
        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p3);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0, 0,
            500, 500,
            startX, startY,
            240, 240
        );
        startY += 250;
        Helper.wrapText(this.ctx, startX, startY, width, lineHeight, p4);
        startY += 50;
        this.ctx.drawImage(
            this.img,
            0, 0,
            500, 500,
            startX, startY,
            240, 240
        );

        let btn = this.dataStore.get('btnSprite');
        btn.drawButton(3, 10, 23, 100, 40);
    }


    addListen() {


        // wx.onTouchMove(res => {
        //     if (this.dataStore.get('sceneFlag') != 7) return;
        //
        //     let moveY = res.touches[0].clientY;
        //     let startY = this.dataStore.get('touchStartY');
        //     let step = moveY - startY;
        //     this.startY = this.beginY + step;
        //     if (this.moving == true) {
        //         return;
        //     }
        //     this.moving = true;
        //     callback();
        //     this.moving = false;
        // });
        // wx.onTouchEnd(res => {
        //     if (this.dataStore.get('sceneFlag') != 7) return;
        //     this.beginY = this.startY;
        //     this.moving = false;
        //
        // });
    }

    skill() {
        //基本
        let arr = [
            [0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 4, 0, 0],//向右移
            [0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 4],//再向右移动
            [0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 4, 0, 0, 0, 4],//相同的，相加
        ];
        let actions = [
            'moveRight', 'moveRight'
        ];
        let numberSprite = this.dataStore.get('numberSprite');
        for (let k in arr[this.skillStep]) {
            let j = Math.floor(k / 4);
            let i = k % 4;
            numberSprite.arr[i][j].updateValue(arr[this.skillStep][k]);
        }
        // this.moveAction = actions[this.skillStep-1];

        this.skillStep++;

        if (this.skillStep == 3) {
            this.isSkill = false;
            wx.showToast({
                title: '就是这么简单，你学会了吗？',
                icon: 'success',
                // image:'images/edit.png',
                duration: 1000
            });
        }
        //技巧
    }

    slide(direction) {
        let img = this.dataStore.res.get('slide');
        let timeStep = 5000;
        let iconWidth = 60;
        let now = Date.parse(new Date());
        let top = this.dataStore.get('topSpace');
        let bottom = this.dataStore.get('bottomY') - iconWidth;
        let left = 10 + iconWidth / 2;
        let right = this.dataStore.get('canvasWidth') - 10 - iconWidth;
        let middleX = (this.dataStore.get('canvasWidth') - iconWidth) / 2;
        let middleY = (this.dataStore.get('canvasWidth') - iconWidth) / 2 + top;

        let speed = this.dataStore.get('deltaTime') * 0.1 * this.speed;


        switch (direction) {
            case 'moveDown':
                if (this.slideStartY > bottom || this.slideStartY == 0) {
                    if (this.timestamp > now) {
                        return;
                    }
                    this.timestamp = now + timeStep;
                    this.slideStartY = top;
                } else {
                    this.slideStartY += speed;
                }
                this.slideStartX = middleX;
                break;
            case 'moveUp':
                if (this.slideStartY < top || this.slideStartY == 0) {
                    if (this.timestamp > now) {
                        return;
                    }
                    this.timestamp = now + timeStep;
                    this.slideStartY = bottom;
                } else {
                    this.slideStartY -= speed;
                }
                this.slideStartX = middleX;
                break;
            case 'moveRight':
                if (this.slideStartX > right) {
                    if (this.timestamp > now) {
                        return;
                    }
                    this.timestamp = now + timeStep;
                    this.slideStartX = left;
                    return;
                } else if (this.slideStartX == 0) {
                    this.slideStartX = left;
                } else {
                    this.slideStartX += speed;
                }
                this.slideStartY = middleY;
                break;
            case 'moveLeft':
                if (this.slideStartX < left || this.slideStartX == 0) {
                    if (this.timestamp > now) {
                        return;
                    }
                    this.timestamp = now + timeStep;
                    this.slideStartX = right;
                } else {
                    this.slideStartX -= speed;
                }
                this.slideStartY = middleY;
                break;
        }
        this.ctx.save();
        this.ctx.drawImage(img, 0, 0, 60, 60, this.slideStartX, this.slideStartY, 60, 60);
        this.ctx.restore();
    }

}