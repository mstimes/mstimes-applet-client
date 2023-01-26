Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentResultSuccess: 1,
    orderNumber: '',
    sumPrice: 0,
    header: {
      "color": "#000",
      "flag": 1,
      "name": "支付结果"
    },
  },

  onLoad: function (options) {
    this.setData({
      paymentResultSuccess: options.paymentSuccess,
      orderNumber: options.orderNumber,
      sumPrice: options.sumPrice,
    })
  },

  returnHomeButtonTap: function(){
    wx.switchTab({
      url: '/pages/market/main_page/main',
    })
  }
});