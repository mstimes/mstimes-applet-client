var plugin = requirePlugin("logisticsPlugin");

Page({
  data: {
    nickName: '',
    userNumber: '',
    waybillToken: '',
    userType: 0,
    userLevel: 0,
    todaySales: 0,
    todayIncome: 0,
    todayOrderSum: 0,
    sevenDaySales: 0,
    sevenDayIncome: 0,
    sevenDayOrderSum: 0,
    totalSales: 0,
    totalIncome: 0,
    todayOrderSum: 0,
    sevenDayOrderSum: 0,
    totalOrderSum: 0,
    totalFundRemain: 0,
    totalDrawingAmount: 0,
    goodList: [],
    pageNum: 0,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate() + 1;
    var loginInfo = wx.getStorageSync('serviceLogin');
    this.setData({
      userType: loginInfo.userType,
      userLevel: loginInfo.level,
    })

    this.getFundSummaryForToday();
    this.getFundSummaryForSevenDayBefore();
    this.getFundSummary();

    this.getOrderSummaryForToday();
    this.getOrderSummaryForSevenDay();
    this.getOrderSummary();

    this.getFund();

    this.getGoodList();

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

  getGoodList() {
    var _this = this; 
    var loginInfo = wx.getStorageSync('serviceLogin');
    this.setData({
      userNumber: loginInfo.userNumber,
    })

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/goods/queryGoods",
      data: {
        "pageNum": this.data.pageNum,
        "pageSize": this.data.pageSize,
      },
      complete: res=>{
        var goodListTemp = this.data.goodList;
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          var curDataList = res.data.dataList;
          for (var i = 0; i < curDataList.length; i++){
            curDataList[i].mainImage = "https://ghomelifevvip.com/" + curDataList[i].mainImage;
          }
          _this.setData({
            goodList: goodListTemp.concat(curDataList)
          })
        }
      }
    })
  },

  getFundSummaryForToday() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var today = myDate.getDate();
    var tommorrow = myDate.getDate() + 1;

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/fund/queryFundSummary',
      data: {
        "agentId": loginInfo.id,
        "startDate": myDate.getFullYear() + '-' + month + '-' + today,
        "endDate": myDate.getFullYear() + '-' + month + '-' + tommorrow,
      },
      complete: res=>{
        if(res.data.success){
          console.log('fund summary ' + res.data.dataList[0].totalSales);
          console.log('fund my income ' + res.data.dataList[0].myIncome);
          this.setData({
            todaySales: res.data.dataList[0].totalSales,
            todayIncome: res.data.dataList[0].myIncome,
          })
        }else{
          console.error('获取今日金额失败！')
        }
      }
    });
  },

  getFundSummaryForSevenDayBefore() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var sevenDayBefore = myDate.getDate() - 6;
    var tommorrow = myDate.getDate() + 1;

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/fund/queryFundSummary',
      data: {
        "agentId": loginInfo.id,
        "startDate": myDate.getFullYear() + '-' + month + '-' + sevenDayBefore,
        "endDate": myDate.getFullYear() + '-' + month + '-' + tommorrow,
      },
      complete: res=>{
        if(res.data.success){
          console.log('fund summary ' + res.data.dataList[0].totalSales);
          console.log('fund my income ' + res.data.dataList[0].myIncome);
          this.setData({
            sevenDaySales: res.data.dataList[0].totalSales,
            sevenDayIncome: res.data.dataList[0].myIncome,
          })
        }else{
          console.error('获取近七天金额失败！')
        }
      }
    });
  },

  getFundSummary() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var today = myDate.getDate();
    var tommorrow = myDate.getDate() + 1;

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/fund/queryFundSummary',
      data: {
        "agentId": loginInfo.id,
        "startDate": '2021-01-01',
        "endDate": myDate.getFullYear() + '-' + month + '-' + tommorrow,
      },
      complete: res=>{
        if(res.data.success){
          console.log('fund summary ' + res.data.dataList[0].totalSales);
          console.log('fund my income ' + res.data.dataList[0].myIncome);
          this.setData({
            totalSales: res.data.dataList[0].totalSales,
            totalIncome: res.data.dataList[0].myIncome,
          })
        }else{
          console.error('获取总金额失败！')
        }
      }
    });
  },

  getOrderSummaryForToday() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var today = myDate.getDate();
    var tommorrow = myDate.getDate() + 1;

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryAccountOrderSummary',
      data: {
        "userNumber": loginInfo.userNumber,
        "startTime": myDate.getFullYear() + '-' + month + '-' + today,
        "endTime": myDate.getFullYear() + '-' + month + '-' + tommorrow,
      },
      complete: res=>{
        if(res.data.success){
          console.log('order summary ' + res.data.dataList[0].sumCount);
          this.setData({
            todayOrderSum: res.data.dataList[0].sumCount,
          })
        }else{
          console.error('获取今日订单数失败！')
        }
      }
    });
  },

  getOrderSummaryForSevenDay() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var sevenDay = myDate.getDate() - 6;
    var tommorrow = myDate.getDate() + 1;

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryAccountOrderSummary',
      data: {
        "userNumber": loginInfo.userNumber,
        "startTime": myDate.getFullYear() + '-' + month + '-' + sevenDay,
        "endTime": myDate.getFullYear() + '-' + month + '-' + tommorrow,
      },
      complete: res=>{
        if(res.data.success){
          console.log('order summary seven day ' + res.data.dataList[0].sumCount);
          this.setData({
            sevenDayOrderSum: res.data.dataList[0].sumCount,
          })
        }else{
          console.error('获取近七日订单数失败！')
        }
      }
    });
  },

  getOrderSummary() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var today = myDate.getDate();
    var tommorrow = myDate.getDate() + 1;

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryAccountOrderSummary',
      data: {
        "userNumber": loginInfo.userNumber,
        "startTime": '2021-01-01',
        "endTime": myDate.getFullYear() + '-' + month + '-' + tommorrow,
      },
      complete: res=>{
        if(res.data.success){
          console.log('total order summary ' + res.data.dataList[0].sumCount);
          this.setData({
            totalOrderSum: res.data.dataList[0].sumCount,
          })
        }else{
          console.error('获取订单总数失败！')
        }
      }
    });
  },

  getFund() {
    var loginInfo = wx.getStorageSync('serviceLogin');

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/fund/queryFundByAgentId',
      data: {
        "agentId": loginInfo.id
      },
      complete: res=>{
        if(res.data.success){
          console.log('totalRemain ' + res.data.dataList[0].totalRemain);
          this.setData({
            totalFundRemain: res.data.dataList[0].totalRemain,
            totalDrawingAmount: res.data.dataList[0].drawingAmount,
          })
        }else{
          console.error('获取资金账户失败！')
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkLogin();
  },

  checkLogin: function () {
    var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
    console.log('wxOpenId ' + getServiceLoginInfo.wxOpenId);
    if(getServiceLoginInfo.userNumber == null || getServiceLoginInfo.wxOpenId == null){
      wx.redirectTo({
        url: "/pages/login/login?originPage=my"
      })
    }
  },

  goBussinessHistoryTap(){
    wx.navigateTo({
      url: '/pages/market/business_history/data_list?checkedIndex=0',
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
    this.data.pageNum += 1;
    this.getGoodList();
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
  },

  drawingTap(){
    wx.showToast({
      title: '该功能暂未开放   请联系客服',
      icon: 'error'
    })
  }

})