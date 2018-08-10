// const apiRoot = 'http://homestead.program/api/v1/';
const apiRoot = "http://program.ibagou.com/api/v1/";
export const apis = {
    user_info:apiRoot + "wechat-pro-user/user-info",
    login: apiRoot + "wechat-program-user/login",//登录
    share:apiRoot +"wechat-numbers/share",//分享
    get_info:apiRoot +"wechat-numbers/info",//下拉游戏数据
    up_info:apiRoot +"wechat-numbers/up-info",//上传游戏数据
    consume:apiRoot +"wechat-numbers/consume",//交换次数的消耗
}