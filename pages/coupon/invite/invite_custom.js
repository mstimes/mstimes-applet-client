// pages/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onReady: function () {
    // 登录
    wx.login({
     success: res => {
       // 发送 res.code 到后台换取 openId, sessionKey, unionId
       // console.log("---------")
       // console.log(res.code)
       if (res.code) {
         // 发起网络请求
         wx.request({
           url: 'https://server.ghomelifevvip.com/wechat/queryAuthSession',
           data: {
             code: res.code
           },
           success: res => {
             if(res.data.success){
               // console.log(res)
               wx.setStorageSync('wechatAuthSession', res.data.dataList[0])
             }else{
               wx.showToast({
                 title: '微信授权网咯请求失败',
                 icon: 'error'
               })
             }
           },
           fail: res => {
             if (res == null || res.data == null){
               wx.showToast({
                 title: '微信授权网咯请求失败',
                 icon: 'error'
               })
             }
           }
         })
       } else {
         wx.showToast({
           title: '登录失败！' + res.errMsg,
           icon: 'error'
         })
       }
     }
   })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toResultPage: function () {

  },

  newAccountRegister(e) {
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    var shareUser = wx.getStorageSync('shareUser')
    if(shareUser == null){
      shareUser = ''
    }

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/user/newUserForApplet",
      data: {
        "code": e.detail.code,
        "unionId": wechatAuthSession.unionid,
        "shareUser": shareUser,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('register new account success. newUserNumber ' + res.data.dataList[0].userNumber);
          wx.navigateTo({
            url: '/pages/coupon/result/receive_result?newUserNumber=' + res.data.dataList[0].userNumber,
          })
        }
      }
    })
  },

  newRegisterByShare (e){
    console.log(e.detail.code)
    if(e.detail.code != undefined){
      var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/user/login',
        data: {
          loginType: 1,
          loginId: wechatAuthSession.unionid
        },
        complete: res => {
          console.log(res)
          if(res.data.success){
            wx.showToast({
              title: '您已注册会员    不能重复领取',
              icon: 'error',
              duration: 3000
            })
          }else{
            this.newAccountRegister(e)
          }
        }
      })
    }
  },
})