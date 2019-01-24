import {DataStore} from "../base/DataStore";

export class Helper {
    static getRandom(n) {
        return Math.floor(Math.random() * n)
    }

    /**
     *
     * @param ctx
     * @param x,y矩形起点
     * @param w,h 矩形宽高
     * @param r 矩形圆角半径
     */
    static roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) {
            r = w / 2;
        }
        if (h < 2 * r) {
            r = h / 2;
        }
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    static wrapText (ctx, x, y, maxWidth, lineHeight, text) {
        if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
            return;
        }
        // 字符分隔为数组
        let arrText = text.split('');
        let line = '';
        for (let n = 0; n < arrText.length; n++) {
            let testLine = line + arrText[n];
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = arrText[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    };

    /**
     * 判断点击是否在某一范围
     */
    static clickIn(touchX, touchY, startX, startY, width, height){
        if (touchX > startX && touchX <startX + width && touchY > startY && touchY < startY + height) {
            return true;
        }
        return false;
    }

    /**
     * 向开放域发送消息
     */
    static postMessage(type, data){
        let openDataContext = wx.getOpenDataContext();
        data.type = type;
        openDataContext.postMessage(data);
    }
}


