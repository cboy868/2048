import {Menu} from "./Menu.js";
import {DataStore} from "../base/DataStore";

export class Undo extends Menu{
    constructor(ctx, img) {
        let dataStore = DataStore.getInstance();
        let num = 0;
        let value = dataStore.get('propUndo');
        let history = dataStore.get('historyRecord');

        let active = false;
        if (history.length>1 && value>0) {
            active = true;
        }

        super(ctx, img, num, value, active);
        this.dataStore = dataStore;
    }

    draw(){
        let value = this.dataStore.get('propUndo');
        super.draw(value);
    }

    update(){
        let value = this.dataStore.get('propUndo');
        let history = this.dataStore.get('historyRecord');
        if (value>0 && history.length>1) {
            this.active = true;
        } else {
            this.active = false;
        }
    }

}