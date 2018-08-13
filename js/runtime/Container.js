import {Helper} from "../lib/Helper.js";
import {Square} from "./Square.js";
import {DataStore} from "../base/DataStore";

export class Container {
    constructor(ctx, img, score = 0) {
        this.ctx = ctx;
        this.img = img;
        this.moveAble = false;
        this.dataStore = DataStore.getInstance();
        this.bestScore = score;
        this.record = [];
        this.swapItems = [];
        this.init();
    }

    init() {
        this.arr = [];
        for (let i = 0; i < 4; i++) {
            this.arr[i] = [];
            for (let j = 0; j < 4; j++) {
                this.arr[i][j] = new Square(this.ctx, this.img, i, j, 0);
            }
        }
        //随机生成前两个。并且不重复。
        let i1, i2, j1, j2;
        do {
            i1 = Helper.getRandom(3), i2 = Helper.getRandom(3), j1 = Helper.getRandom(3), j2 = Helper.getRandom(3);
        } while (i1 == i2 && j1 == j2);

        this.arr[i1][j1].updateValue(2);
        this.arr[i2][j2].updateValue(2);
        this.history();
    }

    draw() {
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                this.arr[i][j].draw();
            }
        }
    }

    score(plus) {
        let score = this.dataStore.get('score');
        score += plus;
        this.dataStore.put('score', score);
    }

    /**
     * 选择移动方向
     * @param target
     */
    move(target) {
        this[target]();
        this.history();
    }

    /**
     * 向下移动
     */
    moveDown() {
        let i, j, k, n;
        for (i = 0; i < 4; i++) {
            n = 3;
            for (j = 3; j >= 0; j--) {
                if (this.arr[i][j].value == 0) {
                    continue;
                }
                k = j + 1;
                aa:
                    while (k <= n) {
                        if (this.arr[i][k].value == 0) {
                            if (k == n || (this.arr[i][k + 1].value != 0 && this.arr[i][k + 1].value != this.arr[i][j].value)) {
                                this.moveCell(i, j, i, k);
                            }
                            k++;

                        } else {
                            if (this.arr[i][k].value == this.arr[i][j].value) {
                                this.mergeCell(i, j, i, k);
                                n--;
                            }
                            break aa;
                        }

                    }
            }
        }

        this.newCell();
    }

    /**
     * 向上移动
     */
    moveUp() {
        let i, j, k, n;
        for (i = 0; i < 4; i++) {
            n = 0;
            for (j = 0; j < 4; j++) {
                if (this.arr[i][j].value == 0) {
                    continue;
                }
                k = j - 1;
                aa:
                    while (k >= n) {
                        if (this.arr[i][k].value == 0) {
                            if (k == n || (this.arr[i][k - 1].value != 0 && this.arr[i][k - 1].value != this.arr[i][j].value)) {
                                this.moveCell(i, j, i, k);
                            }
                            k--;
                        } else {
                            if (this.arr[i][k].value == this.arr[i][j].value) {
                                this.mergeCell(i, j, i, k);
                                n++;
                            }
                            break aa;
                        }

                    }
            }
        }

        this.newCell();
    }

    moveLeft() {
        /*向左移动*/
        let i, j, k, n;

        for (j = 0; j < 4; j++) {
            n = 0;
            for (i = 0; i < 4; i++) {
                if (this.arr[i][j].value == 0) {
                    continue;
                }
                k = i - 1;
                aa:
                    while (k >= n) {
                        if (this.arr[k][j].value == 0) {
                            if (k == n || (this.arr[k - 1][j].value != 0 && this.arr[k - 1][j].value != this.arr[i][j].value)) {
                                this.moveCell(i, j, k, j);
                            }
                            k--;
                        } else {
                            if (this.arr[k][j].value == this.arr[i][j].value) {
                                this.mergeCell(i, j, k, j);
                                n++;
                            }
                            break aa;

                        }
                    }
            }
        }

        this.newCell();
    }

    moveRight() {
        /*向右移动*/
        let i, j, k, n;
        for (j = 0; j < 4; j++) {
            n = 3;
            for (i = 3; i >= 0; i--) {
                if (this.arr[i][j].value == 0) {
                    continue;
                }
                k = i + 1;
                aa:
                    while (k <= n) {
                        if (this.arr[k][j].value == 0) {
                            if (k == n || (this.arr[k + 1][j].value != 0 && this.arr[k + 1][j].value != this.arr[i][j].value)) {
                                this.moveCell(i, j, k, j);
                            }
                            k++;
                        } else {
                            if (this.arr[k][j].value == this.arr[i][j].value) {
                                this.mergeCell(i, j, k, j);
                                n--;
                            }
                            break aa;
                        }
                    }
            }
        }
        this.newCell();
    }

    /**
     * 是否已满
     */
    isFull() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.arr[i][j].value == 0) return false;
            }
        }
        return true;
    }

    /**
     * 是否有可合并的空格
     */
    canntMerge() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.arr[i][j].value == this.arr[i][j + 1].value) return false;
                if (this.arr[j][i].value == this.arr[j + 1][i].value) return false;
            }
        }
        return true;
    }


    moveCell(i, j, m, n) {
        this.arr[i][j].moveCell(this.arr[m][n]);
        this.moveAble = true;
    }

    mergeCell(i, j, m, n) {
        this.arr[i][j].mergeCell(this.arr[m][n]);
        this.score(this.arr[m][n].value);
        this.moveAble = true;
    }

    newCell() {
        /*在空白处掉下来一个新的格子*/
        let i, j, len, index;
        let ableArr = [];
        if (this.moveAble != true) {
            console.log('不能增加新格子，请尝试其他方向移动！');
            this.isFinish();
            return;
        }
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                if (this.arr[i][j].value == 0) {
                    ableArr.push([i, j]);
                }
            }
        }
        len = ableArr.length;
        if (len > 0) {


            index = Helper.getRandom(len);
            i = ableArr[index][0];
            j = ableArr[index][1];
            this.arr[i][j] = new Square(this.ctx, this.img, i, j, 2);
        } else {
            this.isFinish();
            console.log('没有空闲的格子了！');
            return;
        }

        this.moveAble = false;

    }

    /**
     * 游戏结束
     */
    isFinish(){
        if (this.isFull() && this.canntMerge()) {
            wx.showModal({
                title:'游戏结束标题',
                content:'内容',
                showCancel:true,
                cancelText:'结束游戏',
                cancelColor:"#ff0000",
                confirmText:"再玩一次"
            })
            return true;
        }
        return false;
    }

    /**
     * 操作历史，只记最后操作的10步
     */
    history() {
        let numArr = [];
        for (let i = 0; i < 4; i++) {
            numArr[i] = [];
            for (let j = 0; j < 4; j++) {
                numArr[i][j] = this.arr[i][j].value;
            }
        }
        let historyRecord = this.dataStore.get('historyRecord');

        if (historyRecord.length > 0 && historyRecord[0]['cells'].toString() == numArr.toString()) {
            return;
        }
        let dataStore = DataStore.getInstance();
        let data = {
            'cells': numArr,
            'score':dataStore.get('score')
        };
        historyRecord.unshift(data);

        if (historyRecord.length > 11) {
            historyRecord.pop();
        }
        this.dataStore.put('historyRecord', historyRecord);
    }

    /**
     * 回撤到第num步
     * @param num
     */
    undo(num) {
        let historyRecord = this.dataStore.get('historyRecord');
        let length = historyRecord.length;
        if (length <= 1) {
            return false;
        }
        let step = num < length ? num : length - 1;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.arr[i][j].updateValue(historyRecord[step]['cells'][i][j]);
            }
        }
        let dataStore = DataStore.getInstance();
        dataStore.put('score', historyRecord[step]['score']);
        let sliceStep = num < length ? num : length - 1;
        let newHistory;
        if (sliceStep >= 1) {
            newHistory = historyRecord.slice(sliceStep);
            this.dataStore.put('historyRecord', newHistory);
        }

        return true;
    }

    /**
     * 获取可以取消多少步
     */
    getCanUndoNum() {
        let historyRecord = this.dataStore.get('historyRecord');
        let length = historyRecord.length;
        let arr = [];
        if (length <= 1) {
            return false;
        }

        if (length > 1) {
            arr.push('1步');
        }

        if (length > 5) {
            arr.push('5步');
        }

        if (length > 10) {
            arr.push('10步');
        }
        return arr;
    }

    swap(startX, startY){
        let [x,y] = Container.getClickCell(startX, startY);
        this.swapItems.push([x,y]);
        if (this.swapItems.length == 2) {
            this.arr[x][y].swap(this.arr[this.swapItems[0][0]][this.swapItems[0][1]]);
            this.swapItems = [];
            return true;
        }
        return false;
    }

    static getClickCell(touchX, touchY) {
        let dataStore = DataStore.getInstance();
        let squareWidth = dataStore.get('squareEdge');
        let leftSpace = dataStore.get('leftSpace');
        let halfSpace = dataStore.get('spaceBetweenSquare') / 2;
        let topY = dataStore.get('topSpace');
        let rate = dataStore.get('rate');

        let x = Math.floor((touchX - leftSpace - halfSpace) / ((squareWidth + halfSpace * 2)*rate));
        let y = Math.floor((touchY - topY - halfSpace) / ((squareWidth + halfSpace * 2)*rate));

        return [x, y];
    }

}