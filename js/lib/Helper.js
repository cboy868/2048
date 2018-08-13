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
}


