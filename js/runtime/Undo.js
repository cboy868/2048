import {Menu} from "./Menu.js";
import {DataStore} from "../base/DataStore";

export class Undo extends Menu{
    constructor(ctx, img, active = false) {
        let dataStore = DataStore.getInstance();
        let num = 0;
        let value = dataStore.get('propUndo');
        super(ctx, img, num, value, active);
    }
}