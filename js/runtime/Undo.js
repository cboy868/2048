import {Menu} from "./Menu.js";
import {DataStore} from "../base/DataStore";

export class Undo extends Menu{
    constructor(ctx, img) {
        let dataStore = DataStore.getInstance();
        let num = 0;
        super(ctx, img, num);
        this.dataStore = dataStore;
    }

    draw(){
        let value = this.dataStore.get('gameInfo').undo;
        this.update();
        super.draw(value);
    }

    update(){
        let value = this.dataStore.get('gameInfo').undo;
        let history = this.dataStore.get('historyRecord') || [];
        if (value>0 && history.length>1) {
            this.active = true;
        } else {
            this.active = false;
        }
    }

}