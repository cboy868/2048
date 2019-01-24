const ratio = wx.getSystemInfoSync().pixelRatio;
const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;

class Message {
    static getInstance() {
        if (!Message.instance) {
            Message.instance = new Message();
        }
        return Message.instance;
    }

    constructor() {
        this.sharedCanvas = wx.getSharedCanvas();
        this.context = this.sharedCanvas.getContext('2d');

        this.itemCanvas = wx.createCanvas();
        this.ctx = this.itemCanvas.getContext('2d');

        // this.friendsCanvas = wx.createCanvas();
        // this.friendsCtx = this.friendsCanvas.getContext('2d');
        //
        // this.groupCanvas = wx.createCanvas();
        // this.groupCtx = this.groupCanvas.getContext('2d');

        this.score = undefined;
        this.bestScore = undefined;
        this.info = {};
        this.myRank = undefined;

        this.initEle();
        this.addListen();
        this.getInfo();
    }


    initEle() {
        this.context.restore();
        this.context.scale(ratio, ratio);
        this.context.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);

        // 画背景
        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fillRect(0, 0, screenWidth * ratio, screenHeight * ratio);

        // 按照 750的尺寸绘制
        let scales = screenWidth / 750;
        this.context.scale(scales, scales);

        // 画标题
        this.context.fillStyle = '#fff';
        this.context.font = '50px Arial';
        this.context.textAlign = 'center';
        this.context.fillText('好友排行榜', 750 / 2, 220);

        // 排名列表外框
        this.context.fillStyle = '#302F30';
        this.context.fillRect(80, 290, 750 - 80 * 2, 650);

        // 排行榜提示
        this.context.fillStyle = '#8D8D8D';
        this.context.font = '20px Arial';
        this.context.textAlign = 'left';
        this.context.fillText('每周一凌晨刷新', 100, 330);

        // 自己排名外框
        this.context.fillStyle = '#302F30';
        this.context.fillRect(80, 960, 750 - 80 * 2, 120);

        // 返回按钮
        let returnImage = wx.createImage();
        returnImage.src = 'images/return.png';
        returnImage.onload = () => {
            this.context.drawImage(returnImage, 80, 1120, 100, 100);
        };
    }


    /**
     * 上传分数
     */
    upScore() {
        if (this.bestScore < this.score) {
            wx.setUserCloudStorage({
                KVDataList: [{'key': 'score', 'value': this.score.toString()}],
                success: res => {
                },
                fail: res => {
                }
            });
            this.bestScore = this.score;
        }
    }

    getInfo() {
        wx.getUserCloudStorage({
            keyList: ['score'],
            success: res => {
                if (typeof res.KVDataList[0] == 'undefined') {
                    this.bestScore = 0;
                } else {
                    this.bestScore = res.KVDataList[0].value;
                }
            }
        });

        wx.getUserInfo({
            openIdList:['selfOpenId'],
            lang: 'zh_CN',
            success: res => {
                this.info = res.data[0];
            },
            fail: res => {

            }
        })
    }



    getFriendsRanking() {
        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: res => {
                let data = res.data;
                this.initRanklist(this.sortByScore(data));
                this.drawMyRank();
            }
        });
    }

    initRanklist(list) {
        // 至少绘制6个
        let length = Math.max(list.length, 6);
        let itemHeight = 590 / 6;

        this.itemCanvas.width = (750 - 80 * 2);
        this.itemCanvas.height = itemHeight * length;
        let ctx = this.ctx;

        ctx.clearRect(0, 0, this.itemCanvas.width, this.itemCanvas.height);

        for (let i = 0; i < length; i++) {
            if (i % 2 === 0) {
                ctx.fillStyle = '#393739';
            } else {
                ctx.fillStyle = '#302F30';
            }
            ctx.fillRect(0, i * itemHeight, this.itemCanvas.width, itemHeight);
        }

        if (list && list.length > 0) {
            list.map((item, index) => {
                let avatar = wx.createImage();
                avatar.src = item.avatarUrl;
                avatar.onload =  ()=> {
                    ctx.drawImage(avatar, 100, index * itemHeight + 14, 70, 70);
                    this.drawToShareCanvas(0)
                };
                ctx.fillStyle = '#fff';
                ctx.font = '28px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(item.nickname, 190, index * itemHeight + 54);
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(item.score || 0, 550, index * itemHeight + 60);
                ctx.font = 'italic 44px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(index + 1, 46, index * itemHeight + 64)
            });
        } else {
            // 没有数据
        }

        this.drawToShareCanvas(0);
    }

    drawToShareCanvas(y) {
        this.context.clearRect(80, 350, 750 - 80 * 2, 590);
        this.context.fillStyle = '#302F30';
        this.context.fillRect(80, 350, 750 - 80 * 2, 590);
        this.context.drawImage(this.itemCanvas, 0, y, 750 - 80 * 2, 590, 80, 350, 750 - 80 * 2, 590);
    }

    /**
     * 分数排名
     */
    sortByScore(data) {
        let array = [];
        data.map(item => {
            array.push({
                avatarUrl: item.avatarUrl,
                nickname: item.nickname,
                openid: item.openid,
                score: item['KVDataList'][0].value != 'undefined' ? item['KVDataList'][0].value : 0 // 取最高分
            })
        });
        array.sort((a, b) => {
            return parseInt(a['score']) < parseInt(b['score']);
        });
        this.myRank = array.findIndex((item) => {
            return item.nickname === this.info.nickName && item.avatarUrl === this.info.avatarUrl;
        });

        if (this.myRank === -1)
            this.myRank = array.length;

        return array;
    }

    getGroupRanking(ticket) {
        wx.getGroupCloudStorage({
            shareTicket: ticket,
            keyList: ['score'],
            success: res => {
                let data = res.data;
                this.initRanklist(this.sortByScore(data));
                this.drawMyRank();
            },
            fail: res => {
                console.log('getGroupCloudStorage:fail');
                console.log(res.data);
            }
        });
    }

    drawMyRank() {

        if (this.info.avatarUrl && this.bestScore) {
            this.context.clearRect(80, 960, 750 - 80 * 2, 120);
            this.context.fillStyle = '#302F30';
            this.context.fillRect(80, 960, 750 - 80 * 2, 120);

            let avatar = wx.createImage();
            avatar.src = this.info.avatarUrl;
            avatar.onload = () => {
                this.context.drawImage(avatar, 180, 960 + 24, 70, 70);
            };
            this.context.fillStyle = '#fff';
            this.context.font = '28px Arial';
            this.context.textAlign = 'left';
            this.context.fillText(this.info.nickName, 270, 960 + 72);
            this.context.font = 'bold 36px Arial';
            this.context.textAlign = 'right';
            this.context.fillText(this.bestScore || 0, 630, 960 + 76);
            // 自己的名次
            if (this.myRank !== undefined) {
                this.context.font = 'italic 44px Arial';
                this.context.textAlign = 'center';
                this.context.fillText(this.myRank + 1, 126, 960 + 80);
            }
        }
    }

    addListen() {
        //消息事件
        wx.onMessage(data => {
            switch (data.type) {
                case 'updateScore':
                    this.score = data.score;
                    this.upScore();
                    break;
                case 'friends':
                    this.getFriendsRanking();
                    break;
                case 'group':
                    this.getGroupRanking(data.text);
                    break;
                case 'updateShare':
                    console.log('更新分享');
                    console.log(data);
                    break;
            }

        });

        let startY = undefined, moveY = 0;
        // 触摸移动事件
        wx.onTouchMove(e => {
            let touch = e.touches[0];
            // 触摸移动第一次触发的位置
            if (startY === undefined) {
                startY = touch.clientY + moveY;
            }
            moveY = startY - touch.clientY;
            this.drawToShareCanvas(moveY);
        });
        wx.onTouchEnd(e => {
            startY = undefined;
            if (moveY < 0) { // 到顶
                moveY = 0;
            } else if (moveY > this.itemCanvas.height - 590) { // 到底
                moveY = this.itemCanvas.height - 590;
            }
            this.drawToShareCanvas(moveY);
        });
    }
}

let msg = Message.getInstance();


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // sharedCanvas.width = screenWidth * ratio;
// // sharedCanvas.height = screenHeight * ratio;
// let itemCanvas = wx.createCanvas();
// let ctx = itemCanvas.getContext('2d');
//
// let myScore = undefined;
// let myInfo = {};
// let myRank = undefined;
// let score = 100;
// // initEle();
// // getUserInfo();
// // drawHeader();
// drawScore();
// // wx.getUserInfo({
// //     openIdList:['selfOpenId'],
// //     success:res=>{
// //         console.log(res);
// //     }
// // });
//
//
// wx.onMessage(data=>{
//     switch (data.type) {
//         case 'updateScore':
//             score = data.score;
//             drawHeader();
//             break;
//     }
// });
//
//

// // 开放域的getUserInfo 不能获取到openId, 可以在主域获取，并从主域传送
// function getUserInfo() {
//     wx.getUserInfo({
//         openIdList:['selfOpenId'],
//         lang: 'zh_CN',
//         success: res => {
//             myInfo = res.data[0];
//         },
//         fail: res => {
//
//         }
//     })
// }
// // 获取自己的分数
// function getMyScore () {
//     wx.getUserCloudStorage({
//         keyList: ['score', 'maxScore', 'undo', 'swap'],
//         success: res => {
//             let data = res;
//             console.log('scoreData');
//             console.log(data);
//             let lastScore = data.KVDataList[0].value || 0;
//             if (!data.KVDataList[1]){
//                 saveMaxScore(lastScore);
//                 myScore = lastScore;
//             } else if (lastScore > data.KVDataList[1].value) {
//                 saveMaxScore(lastScore);
//                 myScore = lastScore;
//             } else {
//                 myScore = data.KVDataList[1].value;
//             }
//         }
//     });
// }
//
// function saveMaxScore(maxScore) {
//     wx.setUserCloudStorage({
//         KVDataList: [{ 'key': 'maxScore', 'value': (''+maxScore) }],
//         success: res => {
//             console.log(res);
//         },
//         fail: res => {
//             console.log(res);
//         }
//     });
// }
//



//
// // let startY = undefined, moveY = 0;
// // // 触摸移动事件
// // wx.onTouchMove(e => {
// //     let touch = e.touches[0];
// //     // 触摸移动第一次触发的位置
// //     if (startY === undefined) {
// //         startY = touch.clientY + moveY;
// //     }
// //     moveY = startY - touch.clientY;
// //     reDrawItem(moveY);
// // });
// // wx.onTouchEnd(e => {
// //     startY = undefined;
// //     if (moveY < 0) { // 到顶
// //         moveY = 0;
// //     } else if (moveY > itemCanvas.height - 590) { // 到底
// //         moveY = itemCanvas.height - 590;
// //     }
// //     reDrawItem(moveY);
// // });