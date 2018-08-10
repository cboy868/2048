import {Helper} from "../lib/Helper.js";
import {Square} from "./Square.js";
import {DataStore} from "../base/DataStore";

export class Container {
    constructor(ctx, img, score=0) {
        this.ctx = ctx;
        this.img = img;
        this.moveAble = false;
        this.dataStore = DataStore.getInstance();
        this.bestScore = score;
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
    }

    draw() {
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = 0; j < this.arr[i].length; j++) {
                this.arr[i][j].draw();
            }
        }
        this.drawScore();
    }

    drawScore(){
        let score = this.dataStore.get('score');
        let img = this.dataStore.res.get('score');
        let rate = this.dataStore.get('rate');

        this.ctx.save();
        this.ctx.drawImage(
            img,0,0,
            img.width,img.height,
            200,30,
            img.width*rate,img.height*rate
        );

        this.ctx.fillStyle  = "#ffffff";
        this.ctx.font="30px April";
        this.ctx.fillText(score, 230, 90);
        this.ctx.fillText(this.bestScore, 280, 90);
        this.ctx.restore();
    }

    score(plus) {
        let score = this.dataStore.get('score');
        score += plus;
        this.dataStore.put('score', score);
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
                                this.moveCell(i,j,i,k);
                            }
                            k++;

                        } else {
                            if (this.arr[i][k].value == this.arr[i][j].value) {
                                this.mergeCell(i,j,i,k);
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
                                this.moveCell(i,j,i,k);
                            }
                            k--;
                        } else {
                            if (this.arr[i][k].value == this.arr[i][j].value) {
                                this.mergeCell(i,j,i,k);
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
                                this.moveCell(i,j,k,j);
                            }
                            k--;
                        } else {
                            if (this.arr[k][j].value == this.arr[i][j].value) {
                                this.mergeCell(i,j,k,j);
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
                                this.moveCell(i,j,k,j);
                            }
                            k++;
                        } else {
                            if (this.arr[k][j].value == this.arr[i][j].value) {
                                this.mergeCell(i,j,k,j);
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
    isFull(){
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (this.arr[i][j].value == 0) return false;
            }
        }
        return true;
    }

    /**
     * 是否有可合并的空格
     */
    canntMerge(){
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                if (this.arr[i][j].value == this.arr[i][j+1].value) return false;
                if (this.arr[j][i].value == this.arr[j+1][i].value) return false;
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

            if (this.isFull() && this.canntMerge()) {
                //这里给出提示

                console.log('游戏结束，也就是说失败了');
            }
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
            console.log('没有空闲的格子了！');
            return;
        }

        this.moveAble = false;

    }

}