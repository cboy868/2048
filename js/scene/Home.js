import {DataStore} from "../base/DataStore";
import {Sprite} from "../base/Sprite";
import {Helper} from "../lib/Helper";


export default class Home {
    constructor(ctx) {
        this.ctx = ctx;
        this.dataStore = DataStore.getInstance();


        this.loop();
    }

    drawBack() {
        this.bg = this.dataStore.get('bgSprite');
        this.bg.draw();

        let backImg = Sprite.getImage('homepage');
        let logoImg = Sprite.getImage('logo');

        this.homeSprite = new Sprite(this.ctx, backImg,
            0, 0,
            backImg.width, backImg.height,
            0, logoImg.height - 60, backImg.width / 2, backImg.height / 2);

        this.homeSprite.draw();
    }

    drawButton() {
        this.btnSprite = this.dataStore.get('btnSprite');

        this.btnStartX = (this.dataStore.get('canvasWidth') - this.btnSprite.width / 2) / 2;
        this.btnStartY = this.homeSprite.height + 40;

        this.user = this.dataStore.get('user');
        if (!this.user.isLogin()) {
            this.user.showLogin(this.btnStartX,this.btnStartY, this.btnSprite.width / 2, this.btnSprite.height / 2,()=>{
                this.dataStore.put('sceneFlag', 2);
                this.cancelEvent();
                this.dataStore.director.init();
            });
        } else {
            //开始挑战
            this.btnSprite.drawButton(0, this.btnStartX, this.btnStartY, this.btnSprite.width / 2, this.btnSprite.height / 2);

            //排行榜
            this.btnSprite.drawButton(2, this.btnStartX, this.btnStartY + this.btnSprite.height / 2 + 10, this.btnSprite.width / 2, this.btnSprite.height / 2);
        }

        this.bindEvent();
    }

    loop() {
        let canvasHeight =  this.dataStore.get('canvasHeight');

        this.ctx.clearRect(0, 0, this.dataStore.get('canvasWidth'), canvasHeight);
        //此处加载头像
        // let shareCanvas = this.dataStore.sharedCanvas;
        // this.ctx.drawImage(shareCanvas, 0, 0, this.dataStore.get('canvasWidth'), canvasHeight);

        this.drawBack();
        this.drawButton();

        if (this.dataStore.shareTicket && !this.showGroup){
            this.showGroup = true;
            this.messageSharecanvas('group',this.dataStore.shareTicket);
        }
        if (this.ranking) {

            // setTimeout(()=>{
            //     this.ctx.drawImage(DataStore.getInstance().sharedCanvas, 0, 0, this.dataStore.get('canvasWidth'), canvasHeight);
            // }, 500);

            this.ctx.drawImage(DataStore.getInstance().sharedCanvas, 0, 0, this.dataStore.get('canvasWidth'), canvasHeight);

            this.requestId = requestAnimationFrame(this.loop.bind(this));
        }
        // this.requestId = requestAnimationFrame(this.loop.bind(this));
    }


    cancelEvent(){
        // wx.offTouchStart();
        cancelAnimationFrame(this.requestId);
    }


    messageSharecanvas(type, text) {
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            type: type || 'friends',
            text: text,
        });
        this.ranking = true;
    }

    bindEvent() {
        wx.offTouchStart();

        if (this.ranking) {
            wx.onTouchStart((e) => {
                let x = e.touches[0].clientX, y = e.touches[0].clientY;
                let scale = this.dataStore.get('canvasWidth') / 750;

                if (Helper.clickIn(x, y, 80 * scale, 1120 * scale,
                    100 * scale, (12200-1120) * scale) == true) {
                    this.ranking = false;
                    this.cancelEvent();
                    this.loop();
                }
            });
            return;
        }
        wx.onTouchStart((e) => {
            let x = e.touches[0].clientX, y = e.touches[0].clientY;
            if (Helper.clickIn(x, y, this.btnStartX, this.btnStartY,
                this.btnSprite.width / 2, this.btnSprite.height / 2) == true) {
                this.dataStore.put('sceneFlag', 2);
                this.cancelEvent();
                this.dataStore.director.init();
            }

            if (Helper.clickIn(x, y, this.btnStartX, this.btnStartY + this.btnSprite.height / 2 + 10,
                this.btnSprite.width / 2, this.btnSprite.height / 2) == true) {
                this.messageSharecanvas();
                this.cancelEvent();
                this.loop();
                // wx.offTouchStart();
            }
        });
    }
}