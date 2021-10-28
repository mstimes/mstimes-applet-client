Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentResultSuccess: 1,
    orderNumber: '',
    sumPrice: 0,
  },

  onLoad: function (options) {
    this.setData({
      paymentResultSuccess: options.paymentSuccess,
      orderNumber: options.orderNumber,
      sumPrice: options.sumPrice,
    })
  },

  returnHomeButtonTap: function(){
    wx.redirectTo({
      url: "/pages/home/home"
    });
  }
});