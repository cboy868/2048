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
        this.dataStore.put('bgSprite', new Bg(this.dataStore.ctx, this.dataStore.res.get('bg')));
        this.dataStore.put('backgroundSprite', new Background(this.dataStore.ctx, this.dataStore.res.get('background')));
        this.dataStore.put('numberSprite', new Container(this.dataStore.ctx, this.dataStore.res.get('number')));

        this.dataStore.put('undoSprite', new Undo(this.dataStore.ctx, this.dataStore.res.get('menu')));
        this.dataStore.put('swapSprite', new Swap(this.dataStore.ctx, this.dataStore.res.get('menu')));
        // this.dataStore.put('restartSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 2, null));
        this.dataStore.put('menuSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 3, null));
        this.dataStore.put('btnSprite', new Buttons(this.dataStore.ctx, this.dataStore.res.get('btns')));

        this.dataStore.put('guide', new Guide(this.dataStore.ctx, this.dataStore.res.get('guide')));

        this.run();
    }

    run() {
        this.u = this.user();
        if (!this.u) {//未登录状态，只显示一个背景
            return;
        }

        this.u.onShare(()=>{
            this.render();
        });

        //整体背景
        this.bgSprite = this.dataStore.get('bgSprite');
        //方块背景
        this.backgroundSprite = this.dataStore.get('backgroundSprite');
        //数字方块
        this.numberSprite = this.dataStore.get('numberSprite');

        this.undoSprite = this.dataStore.get('undoSprite');
        this.swapSprite = this.dataStore.get('swapSprite');
        // this.restartSprite = this.dataStore.get('restartSprite');
        this.menuSprite = this.dataStore.get('menuSprite');
        this.btnSprite = this.dataStore.get('btnSprite');
        this.guide = this.dataStore.get('guide');

        this.render();
        wx.onShow(() => {
            this.render();
        });
    }

    /**
     * 重绘所有元素
     */
    render() {
        // this.dataStore.ctx.clearRect(0, 0, this.dataStore.ctx.canvas.width, this.dataStore.ctx.canvas.height);
        this.bgSprite.draw();
        this.u.draw();
        //
        this.backgroundSprite.draw();

        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
        this.swapSprite.swapItemDraw();
    }

    insc(){
        this.bgSprite.draw();
        this.guide.insc();
    }

    test() {

        // wx.showToast({
        //     title:'玩完了',
        //     icon:'success',
        //     image:'images/edit.png',
        //     duration:10000
        // });
        // wx.showModal({
        //     title:'标题',
        //     content:'内容',
        //     showCancel:true,
        //     cancelText:'结束游戏',
        //     cancelColor:"#ff0000",
        //     confirmText:"再玩一次"
        // })

        // wx.showLoading({
        //     title:'骑上就好',
        //     mask:true,
        //     success:function(){
        //
        //     },
        //     fail:function () {
        //
        //     }
        // });

        // wx.showActionSheet({
        //     itemList:['abcde','123456'],
        //     itemColor:"#008800",
        //     success:function(){
        //
        //     },
        //     fail:function () {
        //
        //     }
        // })


    }

    /**
     * 处理用户信息
     */
    user() {
        let user = this.dataStore.get('user');

        if (!user.isLogin()) {
            user.showLogin();
            return false;
        }
        return user;
    }


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


    touchEvent() {
        let startX = this.dataStore.get('touchStartX');
        let startY = this.dataStore.get('touchStartY');
        let endX = this.dataStore.get('touchEndX');
        let endY = this.dataStore.get('touchEndY');

        let topY = this.dataStore.get('topSpace');
        let menuTopY = this.dataStore.get('bottomY');
        let menuBottomY = this.dataStore.get('menuBottomY');
        let canvasWidth = this.dataStore.get('canvasWidth');
        let leftSpace = this.dataStore.get('leftSpace');


        if ((startY < topY || startY > menuTopY) && this.swapSprite.inSwap ==true) {
            this.swapSprite.inSwap = false;
            this.render();
            return;
        }


        if (this.guide.isInsc == true) {
            if (endX > 10 && endX < 110 && endY>23 && endY<63) {
                this.guide.isInsc = false;
                this.render();
            }
            return;
        }


        if (this.btnSprite.isShow == true) {
            this.touchMenu(endX, endY);
            return;
        }

        if (startY < menuBottomY && startY > menuTopY) {//处理菜单的点击
            if (startX < canvasWidth / 4 && startX > leftSpace && this.undoSprite.active==true) {
                this.menuUndo();
            }
            if (startX < canvasWidth / 2 && startX > canvasWidth / 4 + leftSpace && this.swapSprite.active == true) {
                this.swapSprite.inSwap = true;
                this.render();
                // this.menuSwap();
            }

            if (startX < canvasWidth && startX > (3*canvasWidth) / 4 + leftSpace) {
                this.render();
                this.btnSprite.isShow = true;
                this.btnSprite.halfWay();
            }
            return;
        }



        if (startY > topY && startY < menuTopY && this.swapSprite.inSwap == true) { //交换时事件
            if (this.numberSprite.swap(startX, startY)==true)  {//这里还要请求网络
                this.u.consume('swap', ()=>{
                    this.swapSprite.inSwap = false;
                    this.swapSprite.update();
                    this.render();
                    wx.showToast({
                        title:'恭喜，字块交换成功',
                        icon:'success',
                        image:'images/icon_success.gif',
                        duration:1000
                    });
                });
            } else {
                this.render();
            }
            return false;
        }

        if (startY > topY && startY < menuTopY && this.swapSprite.inSwap != true) {//如果动作不在画板上，则不进行操作
            let stepX = endX - startX;
            let stepY = endY - startY;
            let target;
            if (Math.abs(stepX) >= Math.abs(stepY)) {//方向移动
                target = stepX > 0 ? 'moveRight' : 'moveLeft';
            } else {
                target = stepY > 0 ? 'moveDown' : 'moveUp';
            }
            this.numberSprite.move(target);

            Audio.stop();
            if (this.numberSprite.hasMerge) {
                Audio.merge();
                this.numberSprite.hasMerge = false;
            } else if (this.numberSprite.hasMove) {
                Audio.move();
                this.numberSprite.hasMove = false;
            }

            this.undoSprite.update();
            //处理undo显示状态

            this.render();
        }
    }


    menuUndo() {
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
                    this.u.consume('undo', ()=>{
                        canUndoNum = this.numberSprite.getCanUndoNum();
                        if (!canUndoNum) {
                            this.undoSprite.active = false;
                        } else {
                            this.undoSprite.active = true;
                        }
                        this.render();
                        wx.showToast({
                            title:'恭喜，撤销完成',
                            icon:'success',
                            image:'images/icon_success.gif',
                            duration:1000
                        });
                    });
                }

            }
        });
    }
    touchMenu(startX, startY){
        let btn = this.btnSprite.getTouchBtn(startX, startY);

        if (!isNaN(btn)){
            switch (btn) {
                case 0:
                    this.btnSprite.isShow = false;
                    this.init();
                    break;
                case 1:
                    this.btnSprite.isShow = false;
                    this.guide.isInsc = true;
                    this.insc();
                    break;
                case 3:
                    this.btnSprite.isShow = false;
                    this.run();
                    break;
            }
        }
    }
}