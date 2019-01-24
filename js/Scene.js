import {DataStore} from "./base/DataStore";
import {Request} from "./request/Request";

export class Scene {
    static getInstance() {
        if (!Scene.instance) {
            Scene.instance = new Scene();
        }
        return Scene.instance;
    }

    constructor(){
        this.dataStore = DataStore.getInstance();
        this.lastTime = Date.now();
        //整体背景
    }

    init(){
        this.flag = this.dataStore.get('sceneFlag');//开始场景,用户登录并开始游戏

        this.bgSprite = this.dataStore.get('bgSprite');
        this.user = this.dataStore.get('user');

        this.backgroundSprite = this.dataStore.get('backgroundSprite');
        //数字方块
        this.numberSprite = this.dataStore.get('numberSprite');

        this.undoSprite = this.dataStore.get('undoSprite');
        this.swapSprite = this.dataStore.get('swapSprite');
        // this.restartSprite = this.dataStore.get('restartSprite');
        this.menuSprite = this.dataStore.get('menuSprite');
        this.btnSprite = this.dataStore.get('btnSprite');
        this.guide = this.dataStore.get('guide');

        this.bgSprite.draw();
    }


    render(){
        this.init();
        if (this.flag == 1) {
            this.start();
        }

        if (this.flag == 2) {
            this.play();
        }

        if (this.flag == 3) {//展示菜单
            this.showMenu();
        }

        if (this.flag == 4) {
            this.undoMenu();
        }

        if (this.flag == 5) {
            this.swapMenu();
        }

        if (this.flag == 6) {
            this.skill();
        }

        if (this.flag == 7) {
            this.insc();
        }
    }

    //初始场景
    /**
     * flag = 1;
     */
    start(){
        this.user.showLogin(()=>{
            this.flag = this.dataStore.put('sceneFlag', 2);
            this.dataStore.director.init();
        });
        this.backgroundSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
    }

    /**
     * 开玩
     * flag = 2;
     */
    play(){
        this.user.draw();
        this.backgroundSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
    }

    /**
     * 显示菜单
     * flag = 3
     */
    showMenu(){
        this.btnSprite.isShow = true;
        this.backgroundSprite.draw();
        this.backgroundSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
        this.btnSprite.halfWay();
    }

    /**
     * 撤销操作
     * flag = 4
     */
    undoMenu(){
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
                        this.dataStore.put('sceneFlag', 2);
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

    /**
     * flag = 5;
     */
    swapMenu(){
        this.swapSprite.inSwap = true;
        this.user.draw();
        this.backgroundSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
        this.swapSprite.swapItemDraw();
    }

    /**
     * 技巧展示
     * flag = 6
     */
    skill(){
        this.user.draw();
        this.backgroundSprite.draw();
        this.undoSprite.draw();
        this.menuSprite.draw();
        this.numberSprite.draw();
        this.swapSprite.draw();
        this.guide.slide(this.guide.moveAction);

        // this.guide.skillStep = 0;

        if (this.guide.isSkill == true) {
            requestAnimationFrame(()=>{
                let now = Date.now();
                this.dataStore.put('deltaTime', now - this.lastTime);
                this.lastTime = now;
                this.skill();
            });
        } else {
            this.flag = 2;
            this.dataStore.put('sceneFlag',2);
            this.render();
        }

    }

    /**
     * 说明展示
     * flag = 7
     */
    insc(){
        this.guide.insc();
    }


}