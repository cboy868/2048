import {DataStore} from "./base/DataStore.js";
import {User} from "./runtime/User.js";
import {Audio} from "./base/Audio";
import {Bg} from "./runtime/Bg";
import {Background} from "./runtime/Background";
import {Container} from "./runtime/Container";
import {Undo} from "./runtime/Undo";
import {Swap} from "./runtime/Swap";
import {Menu} from "./runtime/Menu";
import {Buttons} from "./runtime/Buttons";
import {Guide} from "./runtime/Guide";
import {Scene} from "./Scene";
import {Request} from "./request/Request";
import Home from "./scene/Home";
import Play from "./scene/Play";
import SwapScene from "./scene/SwapScene";
import UndoScene from "./scene/UndoScene";
import MenuScene from "./scene/MenuScene";
import InscScene from "./scene/InscScene";

export class Director {

    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {
        this.dataStore = DataStore.getInstance();
    }

    init(){
        this.dataStore.put('user', new User());
        this.dataStore.put('bgSprite', new Bg(this.dataStore.ctx, this.dataStore.res.get('bg')));
        this.dataStore.put('btnSprite', new Buttons(this.dataStore.ctx, this.dataStore.res.get('btns')));
        this.cal();

        this.dataStore.put('backgroundSprite', new Background(this.dataStore.ctx, this.dataStore.res.get('background')));
        this.dataStore.put('numberSprite', new Container(this.dataStore.ctx, this.dataStore.res.get('number')));
        this.dataStore.put('undoSprite', new Undo(this.dataStore.ctx, this.dataStore.res.get('menu')));
        this.dataStore.put('swapSprite', new Swap(this.dataStore.ctx, this.dataStore.res.get('menu')));
        this.dataStore.put('menuSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 3, null));
        this.dataStore.put('guide', new Guide(this.dataStore.ctx, this.dataStore.res.get('guide')));
        this.dataStore.put('audio',  new Audio());

        this.audio = this.dataStore.get('audio');
        this.user = this.dataStore.get('user');

        this.user.onShare();

        wx.onHide(()=>{
            Request.upInfo(this.dataStore.get('score'));
            this.audio.destroy();
        });

        if (this.user.isLogin()){
            Request.getInfo((res)=>{
                if (res.code == 0) {
                    this.dataStore.put('gameInfo', res.data);
                    wx.onShow(()=>{
                        this.run();
                    });
                    this.run();
                } else {
                    wx.clearStorageSync();
                    this.init();
                }
            });
        } else {
            this.dataStore.put('sceneFlag', 1);
            this.run();
        }

        wx.onShow(()=>{
            // this.run();
        });
    }


    run(){
        if (this.dataStore.get('sceneFlag') == 1) {
            this.showHome();
        }
        if (this.dataStore.get('sceneFlag') == 2) {
            this.playGame();
        }

        if (this.dataStore.get('sceneFlag') == 3) {
            this.menu();
        }

        if (this.dataStore.get('sceneFlag') == 4) {
            this.undo();
        }

        if (this.dataStore.get('sceneFlag') == 5) {
            this.swap();
        }

        if (this.dataStore.get('sceneFlag') == 6) {
            this.insc();
        }

    }

    showHome(){
        this.home = new Home(this.dataStore.ctx);
    }

    playGame(){
        let ctx = this.dataStore.ctx;
        this.game = new Play(ctx);
    }

    undo(){
        this.game = new UndoScene(this.dataStore.ctx);
    }

    swap(){
        this.game = new SwapScene(this.dataStore.ctx);
    }


    menu(){
        this.game = new MenuScene(this.dataStore.ctx);
        // this.game.run();
    }

    insc(){
        this.game = new InscScene(this.dataStore.ctx);
        // this.game.run();
    }
    // init() {
    //
    //     this.dataStore.put('gameInfo', {'score':0,'swap':0,'undo':0});
    //     this.dataStore.put('user', new User());
    //     this.user = this.dataStore.get('user');
    //
    //     this.dataStore.put('bgSprite', new Bg(this.dataStore.ctx, this.dataStore.res.get('bg')));
    //     this.dataStore.put('backgroundSprite', new Background(this.dataStore.ctx, this.dataStore.res.get('background')));
    //     this.dataStore.put('numberSprite', new Container(this.dataStore.ctx, this.dataStore.res.get('number')));
    //
    //     this.dataStore.put('undoSprite', new Undo(this.dataStore.ctx, this.dataStore.res.get('menu')));
    //     this.dataStore.put('swapSprite', new Swap(this.dataStore.ctx, this.dataStore.res.get('menu')));
    //     // this.dataStore.put('restartSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 2, null));
    //     this.dataStore.put('menuSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 3, null));
    //
    //
    //
    //
    //     this.lastTime = Date.now();
    //
    //     if (this.user.isLogin()){
    //         Request.getInfo((res)=>{
    //             if (res.code == 0) {
    //                 this.dataStore.put('gameInfo', res.data);
    //                 this.run();
    //             } else {
    //                 wx.clearStorageSync({
    //                     success : function(){
    //                     },
    //                     complete: ()=>{
    //                     }
    //                 });
    //                 this.init();
    //                 console.log("error:获取信息出错了");
    //             }
    //         });
    //     } else {
    //         this.run();
    //     }
    // }
    //

    //
    // test() {
    //
    //     // wx.showToast({
    //     //     title:'玩完了',
    //     //     icon:'success',
    //     //     image:'images/edit.png',
    //     //     duration:10000
    //     // });
    //     // wx.showModal({
    //     //     title:'标题',
    //     //     content:'内容',
    //     //     showCancel:true,
    //     //     cancelText:'结束游戏',
    //     //     cancelColor:"#ff0000",
    //     //     confirmText:"再玩一次"
    //     // })
    //
    //     // wx.showLoading({
    //     //     title:'骑上就好',
    //     //     mask:true,
    //     //     success:function(){
    //     //
    //     //     },
    //     //     fail:function () {
    //     //
    //     //     }
    //     // });
    //
    //     // wx.showActionSheet({
    //     //     itemList:['abcde','123456'],
    //     //     itemColor:"#008800",
    //     //     success:function(){
    //     //
    //     //     },
    //     //     fail:function () {
    //     //
    //     //     }
    //     // })
    //
    //
    // }
    //
    //
    cal() {
        let leftSpace = 10;
        let topSpace = 100;
        let squareEdge = 130;//方块的宽高
        let spaceBetweenSquare = 12;//背景方块之间的距离
        let squareSpaceEdge = 2;//前景方块之间的空白

        let canvas = this.dataStore.canvas;
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        let backGroundImg = this.dataStore.res.get('background');
        let wRate = (canvasWidth - leftSpace * 2) / backGroundImg.width;
        let hRate = canvasHeight / backGroundImg.height;
        let rate = wRate > hRate ? hRate : wRate;
        rate = rate > 1 ? 1.00 : rate.toFixed(6);

        this.dataStore.put('score', 0);
        this.dataStore.put('canvasWidth', canvasWidth);
        this.dataStore.put('canvasHeight', canvasHeight);
        this.dataStore.put('leftSpace', leftSpace);
        this.dataStore.put('rightX', canvasWidth - leftSpace);
        this.dataStore.put('bottomY', topSpace + backGroundImg.height * rate);
        this.dataStore.put('topSpace', topSpace);
        this.dataStore.put('rate', rate);
        this.dataStore.put('squareEdge', squareEdge);
        this.dataStore.put('spaceBetweenSquare', spaceBetweenSquare);//背景方块间距
        this.dataStore.put('squareSpaceEdge', squareSpaceEdge);//数字方块间距，2像素
        this.dataStore.put('historyRecord', []);

    }
    //
    // touchEvent() {
    //     let startX = this.dataStore.get('touchStartX');
    //     let startY = this.dataStore.get('touchStartY');
    //     let endX = this.dataStore.get('touchEndX');
    //     let endY = this.dataStore.get('touchEndY');
    //
    //     let topY = this.dataStore.get('topSpace');
    //     let menuBottomY = this.dataStore.get('menuBottomY');
    //     let menuTopY = this.dataStore.get('menuTopY');
    //     let canvasWidth = this.dataStore.get('canvasWidth');
    //     let leftSpace = this.dataStore.get('leftSpace');
    //     let rate = this.dataStore.get('rate');
    //     let menuSpaceY = 19 * rate;
    //     let menuSpaceX = 27 * rate;
    //     let halfMenuSquare = 90*rate/2;
    //
    //     console.log(this.guide);
    //
    //     this.guide.beginY = this.guide.startY;
    //
    //     switch (this.scene.flag) {
    //         case 1:
    //             return;
    //         case 2:
    //             if (startY > topY && startY < menuTopY) {
    //                 this.play(startX, startY, endX, endY);
    //             }
    //
    //             if (startY < menuBottomY - menuSpaceY && startY > menuTopY + menuSpaceY) {
    //                 this.menu(startX, halfMenuSquare);
    //             }
    //             break;
    //         case 3:
    //             if (startY < topY || startY > menuTopY) {
    //                 this.dataStore.put('sceneFlag', 2);
    //                 this.scene.render();
    //             }
    //
    //             if (this.touchMenu(startX, startY) === false) {
    //                 console.log(1234);
    //                 this.dataStore.put('sceneFlag', 2);
    //                 this.scene.render();
    //             }
    //             break;
    //         case 4:
    //             break;
    //         case 5:
    //             if (startY > topY && startY < menuTopY) {
    //                 this.swap(startX, startY);
    //             }
    //             if (startY < topY || startY > menuTopY) {
    //                 this.swapSprite.inSwap = false;
    //                 this.dataStore.put('sceneFlag', 2);
    //                 this.scene.render();
    //                 return;
    //             }
    //             break;
    //         case 6://skill
    //             if (startY > topY && startY < menuTopY) {
    //                 this.guider(startX, startY, endX, endY);
    //             }
    //
    //             if (startY < menuBottomY - menuSpaceY && startY > menuTopY + menuSpaceY) {
    //                 this.menu(startX, halfMenuSquare);
    //             }
    //             break;
    //         case 7:
    //             if (endX > 10 && endX < 110 && endY>23 && endY<63) {
    //                 this.dataStore.put('sceneFlag', 2);
    //                 this.scene.render();
    //             }
    //             break;
    //         default:
    //             if (startY < topY || startY > menuTopY) {
    //                 this.swapSprite.inSwap = false;
    //                 this.dataStore.put('sceneFlag', 2);
    //                 this.scene.render();
    //                 return;
    //             }
    //     }
    // }
    //

    //
    // guider(startX, startY, endX, endY) {
    //
    //     let stepX = endX - startX;
    //     let stepY = endY - startY;
    //     let target;
    //
    //     if (Math.abs(stepX) >= Math.abs(stepY)) {//方向移动
    //         if (Math.abs(stepX) < 10) return;
    //         target = stepX > 0 ? 'moveRight' : 'moveLeft';
    //     } else {
    //         if (Math.abs(stepY) < 10) return;
    //         target = stepY > 0 ? 'moveDown' : 'moveUp';
    //     }
    //
    //     if (this.guide.moveAction != target) {
    //         wx.showToast({
    //             title:'请按指示方向移动方块',
    //             icon:'error',
    //             image:'images/icon_false.gif',
    //             duration:1000
    //         });
    //         return false;
    //     }
    //     this.guide.skill();
    //     this.undoSprite.update();
    //     //处理undo显示状态
    //
    //     this.run();
    // }
    //

}