import {DataStore} from "./base/DataStore.js";
import {User} from "./runtime/User.js";
import {Bg} from "./runtime/Bg";
import {Background} from "./runtime/Background";
import {Container} from "./runtime/Container";
import {Menu} from "./runtime/Menu";
import {Undo} from "./runtime/Undo";

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

    run(res) {
        console.log(res);

        this.dataStore.put('propSwap', res.swap);
        this.dataStore.put('propUndo', res.undo);
        //整体背景
        this.bgSprite = new Bg(this.dataStore.ctx, this.dataStore.res.get('bg'));
        this.u = this.user();
        if (!this.u) {//未登录状态，只显示一个背景
            return;
        }
        this.backgroundSprite = new Background(this.dataStore.ctx, this.dataStore.res.get('background'));

        let bottomY = this.dataStore.get('bottomY');

        // this.undoSprite = new Prop(this.dataStore.ctx, this.dataStore.res.get('undo'), 140, bottomY+20, res.undo);
        // this.restartSprite = new Prop(this.dataStore.ctx, this.dataStore.res.get('restart'), 200, bottomY+20, null);

        this.undoSprite = new Undo(this.dataStore.ctx, this.dataStore.res.get('menu'));

        let swapActive = res.swap > 0 ? true : false;
        this.swapSprite = new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), swapActive);
        // this.swapSprite = new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 1, res.swap, swapActive);
        this.restartSprite = new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 2, null);
        this.menuSprite = new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 3, null);

        // //数字方块
        this.numberSprite = new Container(this.dataStore.ctx, this.dataStore.res.get('number'), res.score);

        this.render();

        wx.onShow((res) => {
            this.render();
        });
        // this.test();
    }

    /**
     * 重绘所有元素
     */
    render() {
        // this.dataStore.ctx.clearRect(0, 0, this.dataStore.ctx.canvas.width, this.dataStore.ctx.canvas.height);

        this.bgSprite.draw();
        this.u.draw();

        this.backgroundSprite.draw();
        this.restartSprite.draw();
        this.swapSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
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
        let user = new User();

        if (!user.isLogin()) {
            user.showLogin();
            return false;
        }
        return user;
    }


    cal() {
        let leftSpace = 10;
        let topSpace = 150;
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


        if (startY < menuBottomY && startY > menuTopY) {//处理菜单的点击
            if (startX < canvasWidth / 4 && startX > leftSpace) {
                this.menuUndo();
            }
            if (startX < canvasWidth / 2 && startX > canvasWidth / 4 + leftSpace) {
                this.menuSwap();
            }
            return;
        }

        if (startY > topY && startY < menuTopY && this.inSwap == true) { //交换时事件
            if (this.numberSprite.swap(startX, startY)==true)  {//这里还要请求网络
                this.inSwap = false;
                this.render();
            }
            return false;
        }

        if (startY > topY && startY < menuTopY && this.inSwap != true) {//如果动作不在画板上，则不进行操作
            let stepX = endX - startX;
            let stepY = endY - startY;
            let target;
            if (Math.abs(stepX) >= Math.abs(stepY)) {//方向移动
                target = stepX > 0 ? 'moveRight' : 'moveLeft';
            } else {
                target = stepY > 0 ? 'moveDown' : 'moveUp';
            }
            this.numberSprite.move(target);

            //处理undo显示状态
            let canUndoNum = this.numberSprite.getCanUndoNum();
            if (!canUndoNum) {
                this.undoSprite.active = false;
                return;
            }
            this.undoSprite.active = true;
            this.render();
        }

        //处理swap交换显示
        // if (this.swapSprite.value > 0) {
        //     this.swapSprite.active = true;
        // } else {
        //     this.swapSprite.active = false;
        // }

    }

    menuSwap() {
        let ctx = this.dataStore.ctx;
        ctx.fillStyle = "rgb(111,111,111)";
        ctx.globalAlpha = 0.7;
        let canvasWidth = this.dataStore.get('canvasWidth');
        let canvasHeiglt = this.dataStore.get('canvasHeight');
        let topY = this.dataStore.get('topSpace');
        let bottomY = this.dataStore.get('bottomY');
        ctx.beginPath();
        ctx.rect(10, topY, canvasWidth - 20, canvasWidth - 20);
        ctx.fill();
        this.inSwap = true;


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
                this.numberSprite.undo(index);
                canUndoNum = this.numberSprite.getCanUndoNum();
                if (!canUndoNum) {
                    this.undoSprite.active = false;
                } else {
                    this.undoSprite.active = true;
                }
                this.render();
            }
        });
    }
}