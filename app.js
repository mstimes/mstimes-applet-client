// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    //设置字体
    wx.loadFontFace({
      family: 'STKaiti',
      source: '/utils/STKaiti.ttf',
      // success: console.log,
      global:true,
    })
  },
  globalData: {
    userInfo: null
  },
  onShow: function (options) {
    // console.log("app.js show")
    // console.log(options.query.shareUser)

    if(options.query.shareUser != null){
      wx.setStorageSync('shareUser',options.query.shareUser)
    }

    if(options.query.scene != null){
      wx.setStorageSync('scene',options.query.scene)
    }
  },
    
})
