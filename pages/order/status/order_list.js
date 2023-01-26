var plugin = requirePlugin("logisticsPlugin");

Page({
  data: {
    tabs: [
      "待付款",
      "待发货",
      "已发货",
      "已完成",
      "全部订单",
    ],
    checked: 0,
    orderList: [],
    loadedSize: 0,
    totalSize: 0,
    pageNum: 0,
    pageSize: 10,
    userNumber: 0,
    waybillToken: 'AK9nCsB3QyK4GMQBVM0kc00vWtlVjQwjB6wOOeHZsvwkQihLTWRPSXT1hsm2gG-d',
    header: {
      "color": "#000",
      "flag": 1,
      "name": "优惠券"
    },
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

    var orderStatus = options.checkedIndex;
      if(options.checkedIndex == 4){
        orderStatus = -1;
      }else if(options.checkedIndex == 3){
        orderStatus = 7;
      }else if(options.checkedIndex == 2){
        orderStatus = 6;
      }

    this.getOrderRecords(orderStatus);
  },

  getOrderRecords: function(status) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var userId = loginInfo.agentId;
    if(loginInfo.userType == 1){
      userId = loginInfo.id;
    }
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate() + 1;

    var _this = this; 
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/order/queryOrderRecords",
      data: {
        "status": status,
        "userId": userId,
        "userNumber": loginInfo.userNumber,
        "pageNum": this.data.pageNum,
        "pageSize": this.data.pageSize,
        "startTime": '2021-01-01',
        "endTime": myDate.getFullYear() + '-' + month + '-' + day
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
      var orderStatus = index;
      if(index == 4){
        orderStatus = -1;
      }else if(index == 3){
        orderStatus = 7;
      }else if(index == 2){
        orderStatus = 6;
      }

      this.setData({ 
        checked: e.target.dataset.idx,
        orderList: []
      })
      this.getOrderRecords(orderStatus);
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