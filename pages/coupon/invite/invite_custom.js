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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    var shareUser = wx.getStorageSync('shareUser');
    var loginInfo = wx.getStorageSync('serviceLogin');

    // 申请优惠券
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/coupon/createUserCoupons",
      data: {
        "category" : 1,
        "receiverNo" : loginInfo.userNumber,
        "sharerNo": shareUser,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log("createUserCoupons success!");
        }
      }
    })

    wx.navigateTo({
      url: `${'/pages/coupon/result/receive_result'}`,
    })
  }
})