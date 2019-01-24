import {ResourceLoader} from "./base/ResourceLoader.js";
import {DataStore} from "./base/DataStore.js";
import {Director} from "./Director.js";
import {Scene} from "./Scene";
import {Helper} from "./lib/Helper";

const ratio = wx.getSystemInfoSync().pixelRatio;

export class Main {
    constructor() {
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');

        this.offCanvas = wx.createCanvas();
        this.offCtx = this.offCanvas.getContext('2d');

        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();
        this.scene = Scene.getInstance();

        // this.canvas.width = screenWidth * ratio;
        // this.canvas.height = screenHeight * ratio;
        // this.ctx.scale(ratio,ratio);


        this.screenWidth = this.canvas.width;
        this.screenHeight = this.canvas.height;

        let openDataContext = wx.getOpenDataContext();
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width = this.screenWidth * ratio;
        this.sharedCanvas.height = this.screenHeight * ratio;


        const loader = ResourceLoader.create();
        loader.onLoaded((map) => this.onResFirstLoaded(map));
    }

    onResFirstLoaded(map) {
        // this.dataStore.canvas2 = this.canvas2;
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;

        this.dataStore.sharedCanvas = this.sharedCanvas;

        this.dataStore.offCanvas = this.offCanvas;
        this.dataStore.offCtx = this.offCtx;

        // this.dataStore.ctx2 = this.ctx2;
        this.dataStore.res = map;
        this.dataStore.director = this.director;
        this.dataStore.scene = this.scene;
        // this.director.cal();
        this.dataStore.put('sceneFlag', 2);

        // this.director.init();

        this.director.init();
        // this.onShare();
        wx.onShow(res => {
            console.log(res);
            this.dataStore.put('shareTicket', res.shareTicket);
        });
        // this.registerEvent();
    }



    // onShare() {
    //     wx.showShareMenu({
    //         withShareTicket: true,
    //     });
    //     wx.onShareAppMessage((res) => {
    //         if (res.from === 'button') {
    //             console.log("来自页面内转发按钮");
    //             console.log(res.target);
    //         }
    //         else {
    //             console.log("来自右上角转发菜单");
    //         }
    //         return {
    //             title: '2048站着玩',
    //             path: '/pages/share/share?id=123',
    //             imageUrl: "/images/mainbg.png",
    //             success: (res) => {
    //                 let shareTickets = res.shareTickets;
    //                 if (shareTickets.length == 0) {
    //                     return false;
    //                 }
    //                 wx.getShareInfo({
    //                     shareTicket: shareTickets[0],
    //                     success: (res) => {
    //                         wx.checkSession({
    //                             success: () => {
    //                                 this.share(res,'',shareTickets[0],callback);
    //                             },
    //                             fail:() => {
    //                                 wx.login({
    //                                     success: (loginRes) => {
    //                                         if (loginRes.code) {
    //                                             this.share(res,loginRes.code,shareTickets[0],callback);
    //                                         } else {
    //                                             console.log('获取用户登录态失败！' + res.errMsg);
    //                                         }
    //                                     },
    //                                     fail: function () {
    //                                         console.log('获取登录态失败');
    //                                     }
    //                                 });
    //                             }
    //                         });
    //
    //                         // Helper.postMessage('updateShare', {shareTicket:shareTickets[0]});
    //                     }
    //                 });
    //
    //
    //             },
    //             fail: (res) => {
    //                 console.log("转发失败", res);
    //             }
    //         }
    //
    //     });
    // }



    // setShare() {
    //     wx.showShareMenu({
    //         withShareTicket: true,
    //     });
    //     wx.onShareAppMessage(() => {
    //         // 用户点击了“转发”按钮
    //         return {
    //             title: '转发标题',
    //             imageUrl: 'https://mtshop1.meitudata.com/5ad58b143a94621047.jpg',
    //             query: 'key1=1&key2=2',
    //             success: (res) => {
    //                 // 问题页面因为没有设置loop 绘制，分享完成后会黑屏，需要重新绘制canvas
    //                 //判断场景，并重新绘制
    //                 if (DataStore.getInstance().currentCanvas === 'questionCanvas') {
    //                     DataStore.getInstance().ctx.drawImage(DataStore.getInstance().offScreenCanvas, 0, 0, this.screenWidth, this.screenHeight);
    //                 }
    //                 if (res.shareTickets) {
    //                     let shareTicket = res.shareTickets[0];
    //                     this.dataStore.shareTicket = shareTicket;
    //                 }
    //             },
    //             fail: (res) => {

    //             }
    //         }
    //     })
    // }

    // registerEvent() {
    //     let startX = 0, endX = 0, startY = 0, endY = 0;
    //     wx.onTouchStart(res => {
    //         startX = res.touches[0].clientX;
    //         startY = res.touches[0].clientY;
    //
    //         this.dataStore.put('touchStartX', startX);
    //         this.dataStore.put('touchStartY', startY);
    //     });
    //     wx.onTouchEnd(res => {
    //         endX = res.changedTouches[0].clientX;
    //         endY = res.changedTouches[0].clientY;
    //
    //         this.dataStore.put('touchEndX', endX);
    //         this.dataStore.put('touchEndY', endY);
    //         this.director.touchEvent();
    //     });
    //
    //     wx.onTouchMove(res => {
    //         this.dataStore.put('moveX', res.touches[0].clientX);
    //         this.dataStore.put('moveY', res.touches[0].clientY);
    //         // this.director.moveEvent();
    //     });
    //
    // }

}
