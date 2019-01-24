import {DataStore} from "../base/DataStore";
import {Helper} from "../lib/Helper";

export default class Play {
    constructor(ctx) {
        this.ctx = ctx;
        this.dataStore = DataStore.getInstance();
        this.run();
        this.bindEvent();
    }

    run() {
        this.ctx.clearRect(0, 0, this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));
        this.draw();

        // let shareCanvas = this.dataStore.sharedCanvas;
        // this.ctx.drawImage(shareCanvas, 0, 0, this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));
        // this.requestId = requestAnimationFrame(() => {
        //     this.run();
        // });
        //
        // setTimeout(() => {
        //     cancelAnimationFrame(this.requestId);
        // }, 5000);//大概这么长时间，shareCanvas就可以加载过来了

    }

    draw() {
        this.bg = this.dataStore.get('bgSprite');
        this.user = this.dataStore.get('user');

        this.backgroundSprite = this.dataStore.get('backgroundSprite');

        this.undoSprite = this.dataStore.get('undoSprite');
        this.swapSprite = this.dataStore.get('swapSprite');
        this.btnSprite = this.dataStore.get('btnSprite');
        this.menuSprite = this.dataStore.get('menuSprite');
        this.numberSprite = this.dataStore.get('numberSprite');


        this.bg.draw();
        this.backgroundSprite.draw();

        this.undoSprite.draw();
        this.swapSprite.draw();
        this.menuSprite.draw();
        this.user.draw();
        this.numberSprite.draw();
    }

    bindEvent() {
        wx.offTouchStart();
        let startX = 0, endX = 0, startY = 0, endY = 0;

        wx.onTouchStart(res => {
            startX = res.touches[0].clientX;
            startY = res.touches[0].clientY;
        });

        wx.onTouchEnd(res => {
            endX = res.changedTouches[0].clientX;
            endY = res.changedTouches[0].clientY;
            let topY = this.dataStore.get('topSpace');
            let menuTopY = this.dataStore.get('menuTopY');
            let menuBottomY = this.dataStore.get('menuBottomY');
            let rate = this.dataStore.get('rate');
            let menuSpaceY = 19 * rate;
            let halfMenuSquare = 90 * rate / 2;

            if (startY > topY && startY < menuTopY) {
                this.play(startX, startY, endX, endY);
            }

            if (startY < menuBottomY - menuSpaceY && startY > menuTopY + menuSpaceY) {
                this.menu(startX, halfMenuSquare);
            }
            // this.dataStore.put('touchEndX', endX);
            // this.dataStore.put('touchEndY', endY);
        });
    }


    play(startX, startY, endX, endY) {
        let stepX = endX - startX;
        let stepY = endY - startY;
        let target;

        if (Math.abs(stepX) >= Math.abs(stepY)) {//方向移动
            if (Math.abs(stepX) < 10) return;
            target = stepX > 0 ? 'moveRight' : 'moveLeft';
        } else {
            if (Math.abs(stepY) < 10) return;
            target = stepY > 0 ? 'moveDown' : 'moveUp';
        }
        this.numberSprite.move(target);
        this.audio = this.dataStore.get('audio');
        this.audio.stop();
        if (this.numberSprite.hasMerge) {
            Helper.postMessage('updateScore', {score:this.dataStore.get('score')});
            this.audio.merge();
            this.numberSprite.hasMerge = false;
        } else if (this.numberSprite.hasMove) {
            this.audio.move();
            this.numberSprite.hasMove = false;
        }
        this.undoSprite.update();
        this.run();
    }


    menu(startX, halfMenuSquare) {
        let canvasWidth = this.dataStore.get('canvasWidth');
        let leftSpace = this.dataStore.get('leftSpace');
        let step = (canvasWidth-20)/8;

        if (startX <step*7 + leftSpace + halfMenuSquare && startX > step*7 + leftSpace - halfMenuSquare) {
            this.dataStore.put('sceneFlag', 3);
            this.cancelEvent();
            this.dataStore.director.run();
        }

        if (startX < step + leftSpace + halfMenuSquare && startX > step + leftSpace - halfMenuSquare && this.undoSprite.active == true) {
            this.dataStore.put('sceneFlag', 4);
            this.cancelEvent();
            this.dataStore.director.run();
        }

        if (startX < step*3 + leftSpace + halfMenuSquare && startX >  step*3 + leftSpace - halfMenuSquare && this.swapSprite.active == true) {
            this.dataStore.put('sceneFlag', 5);
            this.cancelEvent();
            this.dataStore.director.run();
        }
    }

    cancelEvent(){
        wx.offTouchStart();
        wx.offTouchEnd();
        cancelAnimationFrame(this.requestId);
    }


}