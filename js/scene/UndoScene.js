import {DataStore} from "../base/DataStore";

export default class UndoScene {
    constructor(ctx) {
        this.ctx = ctx;
        this.dataStore = DataStore.getInstance();
        this.run();
        // this.bindEvent();
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

        this.doUndo();
    }

    // bindEvent() {
    //     wx.offTouchStart();
    //     let startX = 0, endX = 0, startY = 0, endY = 0;
    //     wx.onTouchStart(res => {
    //         startX = res.touches[0].clientX;
    //         startY = res.touches[0].clientY;
    //     });
    //     wx.onTouchEnd(res => {
    //         endX = res.changedTouches[0].clientX;
    //         endY = res.changedTouches[0].clientY;
    //         let topY = this.dataStore.get('topSpace');
    //         let menuTopY = this.dataStore.get('menuTopY');
    //
    //
    //         // if (startY > topY && startY < menuTopY) {
    //         // }
    //         // if (startY < topY || startY > menuTopY) {
    //             this.dataStore.put('sceneFlag', 2);
    //             this.cancelEvent();
    //             this.dataStore.director.run();
    //         // }
    //
    //         console.log('undo');
    //     });
    // }
    // cancelEvent(){
    //     wx.offTouchStart();
    //     wx.offTouchEnd();
    //     cancelAnimationFrame(this.requestId);
    // }

    doUndo(){
        let canUndoNum = this.numberSprite.getCanUndoNum();
        if (!canUndoNum) {
            return;
        }
        wx.showActionSheet({
            itemList: canUndoNum,
            success: (res) => {
                let index = 0;
                switch (res.tapIndex) {
                    case 0:
                        index = 1;
                        break;
                    case 1:
                        index = 5;
                        break;
                    case 2:
                        index = 10;
                        break;
                    default:
                        break;
                }

                if (this.numberSprite.undo(index)) {
                    this.user.consume('undo', ()=>{
                        canUndoNum = this.numberSprite.getCanUndoNum();
                        if (!canUndoNum) {
                            this.undoSprite.active = false;
                        } else {
                            this.undoSprite.active = true;
                        }
                        wx.showToast({
                            title:'恭喜，撤销完成',
                            icon:'success',
                            image:'images/icon_success.gif',
                            duration:1000
                        });
                        this.dataStore.put('sceneFlag', 2);
                        this.dataStore.director.run();
                    });
                }

            },
            fail:res=>{
                console.log(res);
                // this.cancelEvent();
                this.dataStore.put('sceneFlag', 2);
                this.dataStore.director.run();
            }
        });
    }

}