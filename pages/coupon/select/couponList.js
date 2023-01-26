// pages/coupon/couponList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: 0,
    couponList: [],
    usedCouponList: [],
    loadedCouponSize: 0,
    totalCouponSize: 0,
    pageNum: 0,
    pageSize: 10,
    userNumber: 0,
    header: {
      "color": "#000",
      "flag": 1,
      "name": "选择优惠券"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    this.setData({
      userNumber: loginInfo.userNumber,
    })
    var discountCoupon = wx.getStorageSync('selectedDiscountCoupon');
    if(discountCoupon == 0){
      this.getCouponRecords(1);
    }else {
      this.setData({
        couponList: wx.getStorageSync('selectedCouponList')
      })
    }
  },

  getCouponRecords: function(status){
    var loginInfo = wx.getStorageSync('serviceLogin');

    var _this = this; 
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/coupon/queryUserCoupons",
      data: {
        "status": status,
        "userNumber": loginInfo.userNumber,
        "pageNum": this.data.pageNum,
        "pageSize": this.data.pageSize,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log("coupon list length " + res.data.dataList.length + ", pageTotalCount" + res.data.pageTotalCount)
          var couponListTemp = this.data.couponList;
          var usedCouponListTemp = this.data.usedCouponList;
          if(status == 1){
            _this.setData({
              couponList: couponListTemp.concat(res.data.dataList),
              loadedCouponSize: this.data.loadedCouponSize + res.data.dataList.length,
              totalCouponSize: res.data.pageTotalCount
            })
          }else if(status == 2){
            _this.setData({
              usedCouponList: usedCouponListTemp.concat(res.data.dataList),
              loadedCouponSize: this.data.loadedCouponSize + res.data.dataList.length,
              totalCouponSize: res.data.pageTotalCount
            })
          }
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
    console.log('onReachBottom ' + this.data.loadedCouponSize + "," + this.data.totalCouponSize)
    if(this.data.loadedCouponSize < this.data.totalCouponSize){
      console.log('onReachBottom reload...')
      this.data.pageNum += 1;
      this.getCouponRecords(this.data.checked + 1);
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
      console.log('e.target.dataset.idx ' + e.target.dataset.idx)
      this.setData({ 
        checked: e.target.dataset.idx
      }) 
  },

  selectedCheckTap: function(e) {
    var discountCoupon = 0;
    var couponCategory = '';
    var couponType = 0;
    var couponCode = '';
    console.log('couponList size ' + this.data.couponList.length);
    console.log('index ... ' + e.currentTarget.dataset.index);

    this.data.couponList.forEach(function (v, i) {
      if (i == e.currentTarget.dataset.index) {
        console.log('v.discountCoupon ' + v.discountCoupon + ', i ' + i);
        couponCategory = v.couponCategory;
        discountCoupon = v.discountCoupon;
        couponType = v.couponType;
        couponCode = v.couponCode;
        v.isChecked = true;
      }else {
        v.isChecked = false;
      }
    })

    console.log('confirmSelectCoupon discountCoupon ' + discountCoupon + ', couponCode ' + couponCode);
    wx.setStorageSync('selectedCouponCode', couponCode)
    wx.setStorageSync('selectedDiscountCoupon', discountCoupon)
    wx.setStorageSync('couponType', couponType)
    wx.setStorageSync('selectedCouponCategory', couponCategory)
    wx.setStorageSync('selectedCouponList', this.data.couponList)

    this.setData({ 
      couponList: this.data.couponList
    }) 
  },

  confirmSelectCoupon: function(e) {
    wx.navigateBack({
      delta: 1
    })
  },

  selectedCouponTap: function(e) {
    console.log('selectedCouponTap ... ');
  }
})