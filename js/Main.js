import {ResourceLoader} from "./base/ResourceLoader.js";
import {DataStore} from "./base/DataStore.js";
import {Director} from "./Director.js";
import {Request} from "./request/Request.js";

export class Main {
    constructor() {
        // this.canvas = document.getElementById('game_canvas');
        // this.ctx = this.canvas.getContext('2d');

        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');

        this.canvas2 = wx.createCanvas();
        this.ctx2 = this.canvas2.getContext('2d');

        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();

        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResFirstLoaded(map));
    }

    onResFirstLoaded(map) {
        this.dataStore.canvas2 = this.canvas2;
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        this.dataStore.ctx2 = this.ctx2;
        this.dataStore.res = map;
        this.director.cal();
        this.init();
    }


    init() {
        this.registerEvent();

        Request.getInfo((res)=>{
            this.director.run(res);
        });

    }

    registerEvent() {
        // this.canvas.addEventListener('mousedown', e => {
        //     e.preventDefault();
        //     this.director.moveRight();
        // });

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

            this.director.move();
        });
    }
}
