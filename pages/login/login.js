// pages/login/login.js
Page({
  data: {
    originPage: null,
  },

  getUserProfile(){
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        console.log(res.userInfo)
        this.serviceLogin()
      }
    })
  },
  
  serviceLogin(){
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
          wx.setStorageSync('serviceLogin',res.data.dataList[0])
          console.log('open id ' + res.data.dataList[0].openId);
          if(res.data.dataList[0].openId == null){
            console.log('openId is null.');
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              url: 'https://server.ghomelifevvip.com/user/updateOpenId',
              data: {
                type: res.data.dataList[0].userType,
                openId: wechatAuthSession.openid,
                unionId: wechatAuthSession.unionid
              },
              complete: res => {
                console.log('update open id.')
                var getServiceLoginInfo = wx.getStorageSync('serviceLogin');
                getServiceLoginInfo.wxOpenId = wechatAuthSession.openid;
                wx.setStorageSync('serviceLogin', getServiceLoginInfo);
              }
            })
          }
          this.backPage()
        }else{
          this.newServiceRegister()
        }
      }
    })
  },
  
  newServiceRegister(){
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    var userInfo = wx.getStorageSync('userInfo')
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
    console.log('this.data.originPage ' + this.data.originPage);
    if(this.data.originPage == 'detail'){
      wx.redirectTo({
        url: "/pages/detail/detail?id=" + this.data.detailId
      })
    } else if(this.data.originPage == 'explore'){
      wx.switchTab({
        url: '/pages/explore/explore',
      })
    } else if(this.data.originPage == 'shopping'){
      wx.switchTab({
        url: '/pages/shopping/cart',
      })
    } else if(this.data.originPage == 'my'){
      wx.switchTab({
        url: '/pages/market/my_center/my',
      })
    } else{
      wx.switchTab({
        url: '/pages/vip/vip_page',
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
              console.log('unionid ' + res.data.dataList[0].unionid + ', openid ' + res.data.dataList[0].openid);
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