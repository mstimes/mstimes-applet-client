// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddress: false,
    receiverName: '',
    receiverPhone: 0,
    receiverAddress: '',
    imageUrl: '',
    goodId: 0,
    globalTitle: '',
    groupPrice: 0,
    selectedClassify: '',
    selectedSpecific: '',
    num: 1,
    sumPrice: 0,
    couponCode: '',
    mbeansCounts: 0,
    outTradeNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodId: options.goodId,
      imageUrl: options.imageUrl,
      globalTitle: options.globalTitle,
      groupPrice: options.groupPrice,
      selectedClassify: options.selectedClassify,
      selectedSpecific: options.selectedSpecific,
      num: options.num,
      sumPrice: options.groupPrice * options.num,
    })
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

  getAddressButtonTap: function(){
    var _this = this; 
    wx.chooseAddress({
      success (res) {
        _this.setData({
          showAddress: true,
          receiverName: res.userName,
          receiverPhone: res.telNumber,
          receiverAddress: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo
        })
      }
    })
  },

  paymentButtonTap: function(){
    if(!this.data.showAddress){
      wx.showToast({
        title: '请填写收件地址',
      })
    }else{
      var loginInfo = wx.getStorageSync('serviceLogin');
      wx.request({
        header: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/order/uploadOrderInfo',
        data: {
          "userNumber": loginInfo.userNumber,
          "goodId": this.data.goodId,
          "couponCode": this.data.couponCode,
          "mbeanCounts": this.data.mbeansCounts,
          "classify": this.data.selectedClassify,
          "specific": this.data.selectedSpecific,
          "selectNum": this.data.num,
          "person": this.data.receiverName,
          "telNumber": this.data.receiverPhone,
          "address": this.data.receiverAddress,
        },
        complete: res=>{
          if(res.data.success){
            console.log('下单成功 ' + res.data.dataList[0])
            this.callWxPayment(res.data.dataList[0]);
  
          }else{
            console.error('下单失败 ' + res.data.msg)
          }
        }
      })
    }
  },

  callWxPayment: function(outTradeNo){
    var _this = this; 
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/pay/queryPrepayOrderForApplet',
      data: {
        "outTradeNo" : outTradeNo,
        "goodName": this.data.globalTitle,
        "totalFee": this.data.groupPrice,
        "openId": wechatAuthSession.openid,
      },
      complete: res=>{
        if(res.data.success){
          console.log('获取预支付信息成功 ' + res.data.dataList[0])
          console.log('获取预支付信息成功 ' + res.data.dataList)
          var prepayResponse = res.data.dataList[0];
          // 调用微信支付
          wx.requestPayment({
            timeStamp: prepayResponse.timestamp,
            nonceStr: prepayResponse.nonceStr,
            package: prepayResponse.pack,
            signType: 'MD5',
            paySign: prepayResponse.sign,
            success (res) {
              console.log('调用微信支付成功！')
              wx.navigateTo({
                url: "/pages/order/result/result_page?paymentSuccess=1&orderNumber=" + outTradeNo + "&sumPrice=" + _this.data.sumPrice
              })
            },
            fail (res) {
              console.log('调用微信支付失败！')
              wx.navigateTo({
                url: "/pages/order/result/result_page?paymentSuccess=0&orderNumber=" + outTradeNo + "&sumPrice=" + _this.data.sumPrice
              })
            }
          })
        }else{
          console.error('调用预支付接口失败... ' + res.data.msg)
        }
      }
    })
  }

})