import {ResourceLoader} from "./base/ResourceLoader.js";
import {DataStore} from "./base/DataStore.js";
import {Director} from "./Director.js";
import {Request} from "./request/Request.js";
import {User} from "./runtime/User.js";
import {Container} from "./runtime/Container";
import {Bg} from "./runtime/Bg";
import {Background} from "./runtime/Background";
import {Undo} from "./runtime/Undo";
import {Swap} from "./runtime/Swap";
import {Menu} from "./runtime/Menu";
import {Buttons} from "./runtime/Buttons";

export class Main {
    constructor() {
        // this.canvas = document.getElementById('game_canvas');
        // this.ctx = this.canvas.getContext('2d');


        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');

        // this.canvas2 = wx.createCanvas();
        // this.ctx2 = this.canvas2.getContext('2d');

        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();

        this.user = new User();
        if (!this.user.isLogin()){//没有登录，则先去登录
            this.user.showLogin(()=>{
                Request.getInfo((res)=>{
                    // this.director.run(res);
                    const loader = ResourceLoader.create();
                    loader.onLoaded((map) => this.onResFirstLoaded(map,res));
                });
            });
            return;
        }

        Request.getInfo((res)=>{
            // let res = {};
            // res.score = 10;
            // res.swap = 2;
            // res.undo = 2;
            const loader = ResourceLoader.create();
            loader.onLoaded((map) => this.onResFirstLoaded(map,res));
        });

    }

    onResFirstLoaded(map,res) {
        // this.dataStore.canvas2 = this.canvas2;
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        // this.dataStore.ctx2 = this.ctx2;
        this.dataStore.res = map;
        this.dataStore.director = this.director;
        this.director.cal();

        this.dataStore.put('propSwap', res.swap);
        this.dataStore.put('propUndo', res.undo);
        this.dataStore.put('bestScore', res.score);
        this.dataStore.put('user', this.user);

        this.registerEvent();
        this.director.init();
    }


    // init() {
    //     this.dataStore.put('bgSprite', new Bg(this.dataStore.ctx, this.dataStore.res.get('bg')));
    //     this.dataStore.put('backgroundSprite', new Background(this.dataStore.ctx, this.dataStore.res.get('background')));
    //     this.dataStore.put('numberSprite', new Container(this.dataStore.ctx, this.dataStore.res.get('number')));
    //
    //     this.dataStore.put('undoSprite', new Undo(this.dataStore.ctx, this.dataStore.res.get('menu')));
    //     this.dataStore.put('swapSprite', new Swap(this.dataStore.ctx, this.dataStore.res.get('menu')));
    //     // this.dataStore.put('restartSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 2, null));
    //     this.dataStore.put('menuSprite', new Menu(this.dataStore.ctx, this.dataStore.res.get('menu'), 3, null));
    //     this.dataStore.put('btnSprite', new Buttons(this.dataStore.ctx, this.dataStore.res.get('btns')));
    //
    //     this.director.run();
    // }

    registerEvent() {
        let startX = 0, endX = 0, startY = 0, endY = 0;
        wx.onTouchStart(res => {
            startX = res.touches[0].clientX;
            startY = res.touches[0].clientY;

            this.dataStore.put('touchStartX', startX);
            this.dataStore.put('touchStartY', startY);
        });
        wx.onTouchEnd(res => {
            endX = res.changedTouches[0].clientX;
            endY = res.changedTouches[0].clientY;

            this.dataStore.put('touchEndX', endX);
            this.dataStore.put('touchEndY', endY);



            this.director.touchEvent();
        });

    }


}
