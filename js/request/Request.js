import {DataStore} from "../base/DataStore";
import {apis} from "../base/Apis";
import {Util} from "../lib/Util";

let dataStore = DataStore.getInstance();
export class Request {
    constructor(){
        this.dataStore = DataStore.getInstance();
    }

    /**
     * 获取信息
     * 本期最高score,swap次数,undo次数
     */
    static getInfo(callBack){
        let url = apis.get_info;
        Util.http(url, (res) => {
            callBack(res);
            dataStore.put('gameInfo', res);
        });
    }


    /**
     * 上传游戏信息
     */
    static upInfo(score){
        let url = apis.up_info;
        Util.http(url, (res) => {
            dataStore.put('gameInfo', res);
        },{score:score}, 'POST');
    }
}