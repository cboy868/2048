import {Sprite} from "../base/Sprite";
import {DataStore} from "../base/DataStore";

export class Buttons extends Sprite {
    constructor(ctx, img) {
        super(ctx, img);
        this.width = 272;
        this.height = 80;
        this.isShow = false;
        this.pos = [];
    }

    draw(btnList = []) {
        let dataStore = DataStore.getInstance();
        let canvasWidth = dataStore.get('canvasWidth');
        let canvasHeight = dataStore.get('canvasHeight');
        let rate = dataStore.get('rate');

        let btnHeight = 80;
        let btnWidth = 272;
        let btnNum = btnList.length;
        let btnSpace = 10;
        let totalHeight = btnNum * (btnSpace + btnHeight);
        let info = Buttons.info();

        console.log(info);

        let data = [];
        btnList.forEach((index) => {
            data.push(info[index]);
        });

        let startX = (canvasWidth - btnWidth * rate) / 2;
        let startY = (canvasHeight - totalHeight) / 2;
        this.startY = startY;
        this.endY = startY + totalHeight * rate;
        this.startX = startX;
        this.endX = startX + btnWidth * rate;
        this.space = btnSpace * rate;
        this.height = btnHeight * rate;

        let backY = startY;
        for (let item of data) {
            let [x, y, width, height] = item;

            this.ctx.drawImage(
                this.img,
                x, y,
                width, height,
                startX, backY,
                width * rate, height * rate
            );
            this.pos.push([startX, startX + width * rate, backY, backY + width * rate]);//x1,x2,y1,y2
            backY += (height + btnSpace) * rate;
        }
    }

    static info1() {
        const data = [
            [
                [0, 0, 272, 80],
                [0, 80, 272, 80],
                [0, 400, 272, 80],
            ],
            [
                [0, 160, 272, 80],
                [0, 80, 272, 80],
                // [0, 240, 272, 80],
                [0, 400, 272, 80],
                [0, 480, 272, 80]
            ]
        ];
        // [0, 320, 272, 80],又一个重新开始，重复了
        return data;
    }

    static info() {
        const data = [
            [0, 0, 272, 80],//开始
            [0, 80, 272, 80],//玩法技巧
            [0, 160, 272, 80],//重新开始
            [0, 240, 272, 80],//
            [0, 320, 272, 80],//
            [0, 400, 272, 80],//道具说明
            [0, 480, 272, 80],//返回
        ];
        // [0, 320, 272, 80],又一个重新开始，重复了
        return data;
    }


    getTouchBtn(touchX, touchY) {
        if (touchX < this.startX || touchX > this.endX || touchY < this.startY || touchY > this.endY) {
            return false;
        }
        let spaceAndBtnHeight = this.space + this.height;
        let btn = Math.floor((touchY - this.startY) / spaceAndBtnHeight);
        if (isNaN(btn)) {
            return false;
        }

        let tmpY = this.startY + spaceAndBtnHeight * btn + this.height;
        if (touchY < tmpY) {
            return btn;
        }
        return false;
    }


    start1() {
        let data = Buttons.info();
        this.shadow();
        this.draw(data[0]);
    }

    halfWay() {
        this.shadow();
        // this.draw([0,1,2,3,4,5,6]);
        this.draw([4, 2, 6]);
        // this.draw([4, 1, 3, 2, 6]);
    }

    drawButton(index, btnX, btnY, btnWidth = null, btnHeight = null) {
        let dataStore = DataStore.getInstance();
        let data = Buttons.info();
        let btn = data[index];
        let [x, y, width, height] = btn;
        let rate = dataStore.get('rate');

        btnWidth = btnWidth == null ? width * rate : btnWidth;
        btnHeight = btnHeight == null ? height * rate : btnHeight;
        this.ctx.drawImage(
            this.img,
            x, y,
            width, height,
            btnX, btnY,
            btnWidth, btnHeight
        );
    }


    single1(index, btnX, btnY, btnWidth = null, btnHeight = null) {
        let dataStore = DataStore.getInstance();
        let data = Buttons.info();
        let btn = data[1][index];
        let [x, y, width, height] = btn;
        let rate = dataStore.get('rate');

        btnWidth = btnWidth == null ? width * rate : btnWidth;
        btnHeight = btnHeight == null ? height * rate : btnHeight;
        this.ctx.drawImage(
            this.img,
            x, y,
            width, height,
            btnX, btnY,
            btnWidth, btnHeight
        );
    }

    shadow() {
        let dataStore = DataStore.getInstance();
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = "rgb(111,111,111)";
        ctx.globalAlpha = 0.9;
        let canvasWidth = dataStore.get('canvasWidth');
        let canvasHeight = dataStore.get('canvasHeight');
        ctx.beginPath();
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.fill();
        ctx.restore();
    }
}