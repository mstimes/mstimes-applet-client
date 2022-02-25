// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originPage:null,
  },

  //登录逻辑
  getUserProfile(){
    // 获取用户信息
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        // console.log(res.userInfo)
        this.serviceLogin()
      }
    })
  },
  serviceLogin(){
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    // console.log(wechatAuthSession.unionid)
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
          wx.setStorageSync('serviceLogin',res.data.dataList[0])
          this.backPage()
        }else{
          console.log("走登录流程")
          this.newServiceRegist()
        }
      }
    })
  },
  //后端新用户注册流程
 newServiceRegist(){
  var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
  var userInfo = wx.getStorageSync('userInfo')
  // console.log('新用户注册传的对象')
  // console.log(userInfo)
  var shareUser = wx.getStorageSync('shareUser')
  if(shareUser == null){
    shareUser = ''
  }
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    url: 'https://server.ghomelifevvip.com/user/newUserForApplet',
    data: {
      shareUser: shareUser,
      unionId: wechatAuthSession.unionid,
      name: userInfo.nickName,
      imageUrl: userInfo.avatarUrl,
    },
    complete: res => {
      console.log(res)
      if(res.data.success){
        wx.setStorageSync('serviceLogin',res.data.dataList[0])
      }else{
        console.log('新用户首次注册接口失败' + res.data.msg)
      }
      this.backPage()
    }
  })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      originPage: options.originPage,
      detailId: options.id
    })
  },
  //处理页面跳转返回
  backPage(){
    if(this.data.originPage == 'detail'){
      wx.redirectTo({
        url: "/pages/detail/detail?id=" + this.data.detailId
      })
    } else if(this.data.originPage == 'history'){
      wx.switchTab({
        url: '/pages/hsitory/history',
      })
    } else if(this.data.originPage == 'my'){
      wx.switchTab({
        url: '/pages/order/records/order_records',
      })
    } else{
      wx.switchTab({
        url: '/pages/home/home',
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
  onShow: function (options) {

// console.log(options)
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

  }
})