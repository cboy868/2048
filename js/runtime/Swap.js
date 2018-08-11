import {Menu} from "./Menu.js";
import {DataStore} from "../base/DataStore";

export class Swap extends Menu{
    constructor(ctx, img, active = false) {
        let dataStore = DataStore.getInstance();
        let num = 1;
        let value = dataStore.get('propSwap');
        super(ctx, img, num, value, active);
    }
}