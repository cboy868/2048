import {DataStore} from "../base/DataStore";

export default class InscScene {
    constructor(ctx) {
        this.ctx = ctx;
        this.dataStore = DataStore.getInstance();
        this.run();
        this.bindEvent();
    }

    run() {
        this.ctx.clearRect(0, 0, this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));

        this.bg = this.dataStore.get('bgSprite');
        this.guide = this.dataStore.get('guide');

        this.bg.draw();
        this.guide.insc();
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

            if (endX > 10 && endX < 110 && endY>23 && endY<63) {
                this.dataStore.put('sceneFlag', 3);
                this.cancelEvent();
                this.dataStore.director.run();
            }

        });
    }
    cancelEvent(){
        wx.offTouchStart();
        wx.offTouchEnd();
        // cancelAnimationFrame(this.requestId);
    }


}