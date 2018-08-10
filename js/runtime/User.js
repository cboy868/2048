import {apis} from "../base/Apis.js";
import {Util} from "../lib/Util.js";
import {DataStore} from "../base/DataStore.js";

export class User {
    constructor() {
        this.button();
        this.showShareMenu();
        this.onShare();
        this.arcX = 5;
        this.arcY = 30;
        this.speed = 1;

        let info = this.info();
        if (info) {
            this.headerImage = wx.createImage();
            this.headerImage.src = info.headimgurl;
        }
    }

    button() {
        this.btn = wx.createUserInfoButton({
            type: 'text',
            text: '进入游戏',
            style: {
                left: 60,
                top: 300,
                width: 200,
                height: 50,
                backgroundColor: '#aa0000',
                borderColor: '#000000',
                borderRadius: 10,
                textAlign: 'center',
                fontSize: 20,
                lineHeight: 50
            }
        });
        this.onTap();
        this.btn.hide();
    }

    /**
     * 显示登录按扭
     */
    showLogin(callback) {
        this.callback = callback;
        this.btn.show();
    }

    /**
     * 隐藏登录按扭
     */
    hideLogin() {
        this.btn.hide();
    }

    /**
     * 判断是否已登录
     * @returns {boolean}
     */
    isLogin() {
        return this.info() ? true : false;
    }

    /**
     * 触发按扭点击
     * @param btn
     */
    onTap() {
        let btn = this.btn;
        btn.onTap((tapRes) => {
            wx.login({
                success: (res) => {
                    if (res.code) {
                        let url = apis.login;
                        Util.http(url, (res) => {
                            wx.setStorageSync('uInfo', res.umodal);
                            wx.setStorageSync('access_token', res.umodal.access_token);
                            this.hideLogin();
                            this.callback();
                        }, {code: res.code, data: tapRes}, 'POST');
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg);
                    }
                },
                fail: function () {//未登录时，需要用户先登录
                    console.log('非登录态' + res.errMsg);
                },
                complete: function () {

                }
            });
        })
    }

    headurl(){
        let info = this.info();
        return info ? info.headimgurl : '';
    }

    info() {
        let info = wx.getStorageSync('uInfo');
        if (!info) {
            this.showLogin();
            return false;
        }
        return info;
    }

    draw() {
        let info = this.info();
        if (!info) return false;
        let image = wx.createImage();
        image.src = info.headimgurl;

        let ctx = DataStore.getInstance().ctx;
        let artR = 40;

        image.onload = () => {
            ctx.save();
            ctx.font = "15px April";
            ctx.fillText(info.nickname, 20, 115);
            let d =2 * artR;
            let cx = this.arcX + artR;
            let cy = this.arcY + artR;
            ctx.arc(cx, cy, artR, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(image, this.arcX, this.arcY, d, d);
            ctx.restore();

            // DataStore.getInstance().ctx.drawImage(ctx.canvas,0,0);
            //
        //
        //     //
        //     // let pattern = ctx.createPattern(image, "no-repeat");
        //     //
        //     // // 创建图片纹理
        //     // ctx.font = "15px April";

            // // 绘制一个圆
        //     // ctx.arc(this.arcX, this.arcY, 50, 0, 2 * Math.PI);
        //     // // 填充绘制的圆
        //     // ctx.fillStyle = pattern;
        //     // ctx.fill();
        };

    }

    /**
     * 显示转发菜单
     */
    showShareMenu() {
        wx.showShareMenu({
            withShareTicket: true,
            success: function (res) {
                console.log(res);
            }
        });
    }

    /**
     * 用户转发事件
     */
    onShare() {
        wx.onShareAppMessage((res) => {
            if (res.from === 'button') {
                console.log("来自页面内转发按钮");
                console.log(res.target);
            }
            else {
                console.log("来自右上角转发菜单");
            }
            return {
                title: '2048站着玩',
                path: '/pages/share/share?id=123',
                imageUrl: "/images/mainbg.png",
                success: (res) => {
                    let shareTickets = res.shareTickets;
                    if (shareTickets.length == 0) {
                        return false;
                    }
                    wx.getShareInfo({
                        shareTicket: shareTickets[0],
                        success: (res) => {
                            wx.login({
                                success: (loginRes) => {
                                    if (loginRes.code) {

                                        Util.http(apis.share, function (res) {
                                            console.log(res);
                                        }, { code: loginRes.code, iv: res.iv, encryptedData: res.encryptedData, shareTicket: shareTickets[0]}, 'POST');

                                    } else {
                                        console.log('获取用户登录态失败！' + res.errMsg);
                                    }
                                },
                                fail: function () {

                                }
                            });
                        }
                    });
                    console.log("转发成功", res);
                },
                fail: (res) => {
                    console.log("转发失败", res);
                }
            }

        });
    }

}