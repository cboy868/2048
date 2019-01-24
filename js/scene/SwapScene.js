import {DataStore} from "../base/DataStore";

export default class SwapScene {
    constructor(ctx) {
        this.ctx = ctx;
        this.dataStore = DataStore.getInstance();
        this.run();
        this.bindEvent();
    }

    run() {
        this.ctx.clearRect(0, 0, this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));

        this.bg = this.dataStore.get('bgSprite');
        this.backgroundSprite = this.dataStore.get('backgroundSprite');
        this.undoSprite = this.dataStore.get('undoSprite');
        this.swapSprite = this.dataStore.get('swapSprite');
        this.btnSprite = this.dataStore.get('btnSprite');
        this.menuSprite = this.dataStore.get('menuSprite');
        this.numberSprite = this.dataStore.get('numberSprite');
        this.user = this.dataStore.get('user');

        this.bg.draw();
        this.backgroundSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
        this.swapSprite.shadow();
        this.swapSprite.swapItemDraw();
        this.user.draw();

        // let shareCanvas = this.dataStore.sharedCanvas;
        // this.ctx.drawImage(shareCanvas, 0, 0, this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));
        // this.requestId = requestAnimationFrame(() => {
        //     this.run();
        // });
        //
        // setTimeout(() => {
        //     cancelAnimationFrame(this.requestId);
        // }, 1000);//大概这么长时间，shareCanvas就可以加载过来了
    }

    bindEvent() {
        wx.offTouchStart();
        let startX = 0, endX = 0, startY = 0, endY = 0;
        wx.onTouchStart(res => {
            startX = res.touches[0].clientX;
            startY = res.touches[0].clientY;
        });

        wx.offTouchEnd();
        wx.onTouchEnd(res => {
            endX = res.changedTouches[0].clientX;
            endY = res.changedTouches[0].clientY;
            let topY = this.dataStore.get('topSpace');
            let menuTopY = this.dataStore.get('menuTopY');
            if (startY > topY && startY < menuTopY) {
                this.doSwap(startX, startY);
            }
            if (startY < topY || startY > menuTopY) {
                this.swapSprite.inSwap = false;
                this.dataStore.put('sceneFlag', 2);
                this.cancelEvent();
                this.dataStore.director.run();
            }
        });
    }
    cancelEvent(){
        wx.offTouchStart();
        wx.offTouchEnd();
        cancelAnimationFrame(this.requestId);
    }

    doSwap(startX, startY) {
        if (this.numberSprite.swap(startX, startY) == true) {//这里还要请求网络
            this.user.consume('swap', ()=> {
                this.dataStore.put('sceneFlag', 2);
                this.swapSprite.inSwap = false;
                wx.showToast({
                    title: '恭喜，字块交换成功',
                    icon: 'success',
                    image: 'images/icon_success.gif',
                    duration: 1000
                });
                this.cancelEvent();
                this.dataStore.director.run();
            });

        } else {
            this.run();
        }
    }
}