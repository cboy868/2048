import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore";

export class Background extends Sprite {
    constructor(ctx, img) {
        let dataStore = DataStore.getInstance();

        let leftSpace = dataStore.get('leftSpace');
        let topSpace = dataStore.get('topSpace');
        let rate = dataStore.get('rate');
        super(ctx, img,
            0,0,
            img.width,img.height,
            leftSpace,topSpace,
            img.width*rate,img.height*rate);
    }
}