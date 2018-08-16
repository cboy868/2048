import {apis} from "../base/Apis.js";
import {Util} from "../lib/Util.js";
import {DataStore} from "../base/DataStore.js";

export class User {
    constructor() {
        this.button();
        this.showShareMenu();
        // this.onShare();
        this.arcX = 5;
        this.arcY = 35;
        this.speed = 1;

        let info = this.info();
        if (info) {
            this.headerImage = wx.createImage();
            this.headerImage.src = info.headimgurl;
        }
    }

    button() {
        this.btn = wx.createUserInfoButton({
            type: 'image',
            text: '进入游戏',
            // type:'text',
            image:'images/start.png',
            style: {
                left: 70,
                top: 300,
                width: 203,
                height: 66,
                backgroundColor: '#aa0000',
                borderColor: '#000000',
                borderRadius: 10,
                textAlign: 'center',
                color:'white',
                fontSize: 30,
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
        let rate = DataStore.getInstance().get('rate');
        let artR = 40 * rate;


        this.drawScore(artR*2+this.arcX+5);
        image.onload = () => {
            ctx.save();
            // ctx.font = "15px April";
            // ctx.fillText(info.nickname, 20, 115);
            let d =2 * artR;
            let cx = this.arcX + artR;
            let cy = this.arcY + artR;
            ctx.arc(cx, cy, artR, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(image, this.arcX, this.arcY, d, d);
            ctx.restore();
        };
    }

    drawScore(startX) {
        let dataStore = DataStore.getInstance();
        let score = dataStore.get('score');
        let bestScore = dataStore.get('bestScore');
        let ctx = dataStore.ctx;
        let rate = DataStore.getInstance().get('rate');
        let str = '得分: ' + score;
        let startY = 55;

        let img = dataStore.res.get('score');

        ctx.drawImage(
            img, 0, 0,
            img.width, img.height,
            startX-30, 40,
            108 , 40
        );

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = Math.ceil(22*rate) + "px April";
        ctx.fillText(str, startX, startY);
        ctx.fillText("最高分: " + bestScore, startX, startY+18);
        ctx.restore();
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
    onShare(callback) {
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
                            wx.checkSession({
                                success: () => {
                                    this.share(res,'',shareTickets[0],callback);
                                },
                                fail:() => {
                                    wx.login({
                                        success: (loginRes) => {
                                            if (loginRes.code) {
                                                this.share(res,loginRes.code,shareTickets[0],callback);
                                            } else {
                                                console.log('获取用户登录态失败！' + res.errMsg);
                                            }
                                        },
                                        fail: function () {
                                            console.log('获取登录态失败');
                                        }
                                    });
                                }
                            });
                        }
                    });
                },
                fail: (res) => {
                    console.log("转发失败", res);
                }
            }

        });
    }

    /**
     * 分享处理
     * @param callback  分享后，影响数据，需要重绘
     */
    share(res, code, shareTicket, callback){
        let dataStore = DataStore.getInstance();
        Util.http(apis.share,  (res) => {
            dataStore.put('propSwap', res.swap);
            dataStore.put('propUndo', res.undo);
            callback();
        }, {iv: res.iv, encryptedData: res.encryptedData, shareTicket: shareTicket, code:code }, 'POST');
    }


    /**
     * 使用道具
     * @param type undo swap
     */
    consume(type='undo', callback){
        let dataStore = DataStore.getInstance();
        Util.http(apis.consume,  (res) => {
            dataStore.put('propSwap', res.swap);
            dataStore.put('propUndo', res.undo);
            callback();
        }, {type:type }, 'POST');
    }
}