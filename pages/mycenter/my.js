// pages/mycenter/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImageUrl: '',
    nickName: '',
    userNumber: '',
    consumePrice: 0,
    vipLevel: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate() + 1;
    var loginInfo = wx.getStorageSync('serviceLogin');
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/vip/queryVipLevelInfo',
      data: {
        "userNumber": loginInfo.userNumber,
        "startTime": '2021-01-01',
        "endTime": myDate.getFullYear() + '-' + month + '-' + day,
      },
      complete: res=>{
        if(res.data.success){
          this.setData({
            consumePrice: Math.round(res.data.dataList[0].consumePrice),
            vipLevel: res.data.dataList[0].level
          })
        }else{
          console.error('获取总金额失败！')
        }
      }
    });

    this.setData({
      headImageUrl: loginInfo.imageUrl,
      nickName: loginInfo.name,
      userNumber: loginInfo.userNumber,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkLogin();
  },

  checkLogin: function () {
    var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
    if(getServiceLoginInfo.userNumber == null || getServiceLoginInfo.wxOpenId == null){
      wx.redirectTo({
        url: "/pages/login/login?originPage=my"
      })
    }
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

  openCustomer() {
    wx.openCustomerServiceChat({
      extInfo: {url: 'https://work.weixin.qq.com/kfid/kfcbea782ae5104bd97'},
      corpId: 'ww3e861b16853d7d2b',
      success(res) {
        console.log('open customer success!');
      }
    })
  },

  toVipPrivilege() {
    wx.navigateTo({
      url: '/pages/vip_privilege/vip_privilege',
    })
  }
})