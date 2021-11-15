// pages/order/order_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    pageSize: 5,
    totalOrderRecords: 0,
    loadedOrderRecords: 0,
    orderRecordList: [],
    hasMoreData: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderRecords();
  },

  getOrderRecords: function(){
    var loginInfo = wx.getStorageSync('serviceLogin');
    console.log('pageNum ' + this.data.pageNum + " pageSize " + this.data.pageSize);
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryOrderRecordsByType',
      data: {
        "userNumber": loginInfo.userNumber,
        "userId": 711,
        "queryType": 3,
        "startTime": '2021-01-01',
        "endTime": '2021-11-20',
        "pageNum": this.data.pageNum,
        "pageSize": this.data.pageSize
      },
      complete: res=>{
        var orderRecordsTemp = this.data.orderRecordList;
        if(res.data.success){
          console.log('order info list ' + res.data['dataList'])
          
          var records = res.data['dataList'];
          this.setData({
            totalOrderRecords: res.data['pageTotalCount'],
            loadedOrderRecords: this.data.loadedOrderRecords + records.length,
            orderRecordList: orderRecordsTemp.concat(records),
          });
        }else{
          console.error('order info list not exist ' + res.data.msg)
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
    // console.log('aaa pull down');
    // this.data.pageNum = 1;
    // this.getOrderRecords();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadedOrderRecords < this.data.totalOrderRecords){
      this.data.pageNum += 1;
      this.getOrderRecords();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})