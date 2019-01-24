import {DataStore} from "../base/DataStore";
import {Helper} from "../lib/Helper";

export default class MenuScene {
    constructor(ctx) {
        this.ctx = ctx;
        this.dataStore = DataStore.getInstance();
        this.run();
    }

    run() {
        this.ctx.clearRect(0, 0, this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));
        this.user = this.dataStore.get('user');
        this.bg = this.dataStore.get('bgSprite');
        this.backgroundSprite = this.dataStore.get('backgroundSprite');
        this.undoSprite = this.dataStore.get('undoSprite');
        this.swapSprite = this.dataStore.get('swapSprite');
        this.btnSprite = this.dataStore.get('btnSprite');
        this.menuSprite = this.dataStore.get('menuSprite');
        this.numberSprite = this.dataStore.get('numberSprite');

        this.bg.draw();
        this.backgroundSprite.draw();

        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
        this.user.draw();


        if (this.ranking == true) {
            this.ctx.drawImage(DataStore.getInstance().sharedCanvas,
                0, 0,
                this.dataStore.get('canvasWidth'), this.dataStore.get('canvasHeight'));

            this.requestId = requestAnimationFrame(this.run.bind(this));

            setTimeout(() => {
                cancelAnimationFrame(this.requestId);
            }, 1000);//大概这么长时间，shareCanvas就可以加载过来了

        } else {
            this.btnSprite.halfWay();
        }

        this.bindEvent();
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

            if (this.ranking == true) {
                cancelAnimationFrame(this.requestId);
                let scale = this.dataStore.get('canvasWidth') / 750;
                if (Helper.clickIn(startX, startY, 80 * scale, 1120 * scale,
                    100 * scale, (12200-1120) * scale) == true) {
                    this.cancelEvent();
                    this.ranking = false;
                    this.dataStore.put('sceneFlag', 2);
                    this.dataStore.director.run();
                }
                return;
            }
        });

        wx.offTouchEnd();
        wx.onTouchEnd(res => {
            endX = res.changedTouches[0].clientX;
            endY = res.changedTouches[0].clientY;
            let topY = this.dataStore.get('topSpace');
            let menuTopY = this.dataStore.get('menuTopY');

            if (this.touchMenu(startX, startY) == false) {
                this.dataStore.put('sceneFlag', 2);
                this.cancelEvent();
                this.dataStore.director.run();
            }
            if (startY < topY || startY > menuTopY) {
                this.dataStore.put('sceneFlag', 2);
                this.cancelEvent();
                this.dataStore.director.run();
            }
        });
    }

    messageSharecanvas(type, text) {
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            type: type || 'friends',
            text: text,
        });
        this.ranking = true;
    }


    touchMenu(startX, startY) {
        let btn = this.btnSprite.getTouchBtn(startX, startY);

        if (typeof(btn) == 'number') {
            // this.btnSprite.isShow = false;
            switch (btn) {
                case 0://重新开始
                    this.dataStore.put('sceneFlag', 2);
                    this.cancelEvent();
                    this.dataStore.director.init();
                    break;
                // case 1:
                //     this.dataStore.put('sceneFlag', 6);
                //     this.cancelEvent();
                //     this.dataStore.director.run();
                //     break;
                // case 2:
                //     this.guide = this.dataStore.get('guide');
                //     this.dataStore.put('sceneFlag', 7);
                //     this.guide.skill();
                //
                //
                //     this.guide.isSkill = true;
                //     // this.guide.skillStep = 0;
                //     // this.scene.render();
                //     break;
                case 1://返回
                    this.dataStore.put('sceneFlag', 3);
                    this.messageSharecanvas();
                    this.cancelEvent();
                    this.run();
                    break;
                case 2://返回
                    this.dataStore.put('sceneFlag', 2);
                    this.cancelEvent();
                    this.dataStore.director.run();
                    break;
            }
            return true;
        }

        return false;
    }
    cancelEvent(){
        wx.offTouchStart();
        wx.offTouchEnd();
        cancelAnimationFrame(this.requestId);
    }


}