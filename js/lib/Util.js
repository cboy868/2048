export class Util {
    static http(url, callBack, data={}, method='GET'){
        let access_token = wx.getStorageSync('access_token');

        wx.request({
            url: url + "?access_token=" + access_token,
            method: method,
            data:data,
            header: {
                // 'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                callBack(res.data, data);
            },
            fail: function (error) {
            }
        })
    }
}
