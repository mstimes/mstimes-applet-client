var plugin = requirePlugin("logisticsPlugin");

Page({
  data: {
    tabs: [
      "今日",
      "昨日",
      "近7天",
      "近30天",
      "自定义",
    ],
    checked: 0,
    orderList: [],
    loadedSize: 0,
    totalSize: 0,
    pageNum: 0,
    pageSize: 10,
    userNumber: 0,
    dealAmount: 0,
    incomeAmount: 0,
    dealOrderCounts: 0,
    dealPersons: 0,
    dealSum: 0,
    drawingAmount: 0,
    totalSales: 0,
    totalIncome: 0,
    totalOrderSum: 0,
    totaldealAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('checked index ' + options.checkedIndex);
    var loginInfo = wx.getStorageSync('serviceLogin');
    this.setData({
      userNumber: loginInfo.userNumber,
      checked: options.checkedIndex,
    })

    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var today = myDate.getDate();
    var tommorrow = myDate.getDate() + 1;
    var startTime = myDate.getFullYear() + '-' + month + '-' + today;
    var endTime = myDate.getFullYear() + '-' + month + '-' + tommorrow;

    this.getFundSummary(startTime, endTime);
    this.getOrderSummary(startTime, endTime);
    this.getDealPersonNum(startTime, endTime);
    this.getOrderRecords(startTime, endTime);
  },

  getFundSummary(startDate, endDate) {
    var loginInfo = wx.getStorageSync('serviceLogin');

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/fund/queryFundSummary',
      data: {
        "agentId": loginInfo.id,
        "startDate": startDate,
        "endDate": endDate,
      },
      complete: res=>{
        if(res.data.success){
          this.setData({
            totalSales: res.data.dataList[0].totalSales,
            totalIncome: res.data.dataList[0].myIncome,
          })
        }else{
          console.error('获取金额失败！')
        }
      }
    });
  },

  getDealPersonNum(startTime, endTime) {
    var loginInfo = wx.getStorageSync('serviceLogin');

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryOrderCounts',
      data: {
        "queryType": 4,
        "userId": loginInfo.id,
        "userNumber": loginInfo.userNumber,
        "startTime": startTime,
        "endTime": endTime,
      },
      complete: res=>{
        if(res.data.success){
          console.log('get deal order nums ' + res.data.dataList[0]);
          this.setData({
            dealPersons: res.data.dataList[0],
          })
        }else{
          console.error('获取交易人数失败！')
        }
      }
    });
  },

  getOrderSummary(startTime, endTime) {
    var loginInfo = wx.getStorageSync('serviceLogin');

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryAccountOrderSummary',
      data: {
        "userNumber": loginInfo.userNumber,
        "startTime": startTime,
        "endTime": endTime,
      },
      complete: res=>{
        if(res.data.success){
          console.log('order summary ' + res.data.dataList[0].sumCount);
          this.setData({
            totalOrderSum: res.data.dataList[0].sumCount,
            totaldealAmount: res.data.dataList[0].orderNum,
          })
        }else{
          console.error('获取订单数失败！')
        }
      }
    });
  },

  getOrderRecords: function(startTime, endTime) {
    console.log('startTime ' + startTime + ", endTime " + endTime);
    var loginInfo = wx.getStorageSync('serviceLogin');
    var _this = this; 
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/order/queryOrderRecordsByType",
      data: {
        "queryType": 4,
        "userId": loginInfo.id,
        "userNumber": loginInfo.userNumber,
        "pageNum": this.data.pageNum,
        "pageSize": this.data.pageSize,
        "startTime": startTime,
        "endTime": endTime,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg);
        }else {
          console.log("order list " + res.data.dataList + ", pageTotalCount " + res.data.pageTotalCount)
          var orderListTemp = this.data.orderList;
          _this.setData({
            orderList: orderListTemp.concat(res.data.dataList),
            loadedSize: this.data.loadedSize + res.data.dataList.length,
            totalSize: res.data.pageTotalCount,
          })
        }
      }
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
    console.log('onReachBottom ' + this.data.loadedSize + "," + this.data.totalSize)
    if(this.data.loadedSize < this.data.totalSize){
      console.log('onReachBottom reload...')
      this.data.pageNum += 1;
      this.getOrderRecords(this.data.checked + 1);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindChange: function (e) { 
    this.setData({
        checked: e.detail.current 
    });   
  },
  
  navTip: function (e) { 
    console.log('e.target.dataset.idx ' + e.target.dataset.idx + ", this.data.checked " + this.data.checked)
    var index = e.target.dataset.idx;
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var sevenDayBefore = myDate.getDate() - 6;
    var yesterday = myDate.getDate() - 1;
    var today = myDate.getDate();
    var tommorrow = myDate.getDate() + 1;
    var year = myDate.getFullYear();

    var lastMonth = myDate.getMonth();


    var startTime = '2021-01-01';
    var endTime = year + '-' + month + '-' + tommorrow;
    if(index == 0){
      startTime = year + '-' + month + '-' + today;
    }else if(index == 1){
      startTime = year + '-' + month + '-' + yesterday;
      endTime = year + '-' + month + '-' + today;
    }else if(index == 2){
      startTime = year + '-' + month + '-' + sevenDayBefore;
    }else if(index == 3){
      if(lastMonth == 0){
        lastMonth = 12;
        year = year - 1;
      }
      startTime = year + '-' + lastMonth + '-' + tommorrow;
      endTime = (year + 1) + '-' + lastMonth + '-' + tommorrow;
    }

    this.setData({ 
      checked: e.target.dataset.idx,
      orderList: []
    })

    this.getFundSummary(startTime, endTime);
    this.getOrderSummary(startTime, endTime);
    this.getDealPersonNum(startTime, endTime);
    this.getOrderRecords(startTime, endTime);
  },

  searchLogisticDetail(e) {
    console.log('searchLogisticDetail e.currentTarget.dataset.id ' + e.currentTarget.dataset.id);
    // 在此通过调用 api 来查询微信快递服务详情
    //必须用预览才能测试这个功能，无法在工具端模拟
 		plugin.openWaybillTracking({
     	waybillToken: e.currentTarget.dataset.id
		});
	},

  goBack : function (){
    wx.navigateBack({
      delta: 1
    });
  }
})