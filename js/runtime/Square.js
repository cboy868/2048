import {DataStore} from "../base/DataStore.js";

export class Square {

    constructor(ctx, img, x, y, value) {
        this.ctx = ctx;
        this.img = img;
        this.x = x;
        this.y = y;
        this.value = value;
        this.sel = false;

        this.dataStore = DataStore.getInstance();

        //初始化基础数据
        this.edge = this.dataStore.get('squareEdge');//方块边长
        this.space = this.dataStore.get('squareSpaceEdge');
        this.backRate = this.dataStore.get('rate');
        this.backLeftSpace = this.dataStore.get('leftSpace');
        this.backTopSpace = this.dataStore.get('topSpace');
        this.backEdgeSpace = this.dataStore.get('spaceBetweenSquare');//背景的左右边距

        return this;
    }

    /**
     * 更新值
     */
    updateValue(num) {
        this.value = num;
    }

    draw() {

        let [left, top] = this.backPosition();
        let rate = this.backRate;

        this.ctx.drawImage(
            this.img,
            this.position(this.edge + this.space), 0,//图片裁剪开始位置
            this.edge, this.edge,//图片长高
            left, top,//背景位置
            this.edge * rate, this.edge * rate//占背景长高
        );
    }


    /**
     * 取某一方格的具体位置
     * @returns {*[]}x,y,width,height
     */
    getPosition(){
        let rate = this.backRate;
        let [left, top] = this.backPosition();
        return [left, top, this.edge*rate, this.edge*rate];
    }


    backPosition() {
        let rate = this.backRate;

        let outEdge = this.edge * rate;
        let backSpace = this.backEdgeSpace * rate;

        let left = this.x ? backSpace + (outEdge + backSpace) * this.x : backSpace;
        let top = this.y ? backSpace + (outEdge + backSpace) * this.y : backSpace;

        return [left + this.backLeftSpace, top + this.backTopSpace];
    }

    position(step) {
        if (this.value == 0) return 0;

        let posNum = Math.log(this.value) / Math.log(2);
        return posNum ? posNum * step : 0;
    }

    swap(square){
        let tmp = square.value;
        square.value = this.value;
        this.value = tmp;
    }

    moveCell(square) {
        square.value = this.value;
        this.value = 0;
    }

    mergeCell(square) {
        square.value *= 2;
        this.value = 0;
    }

}