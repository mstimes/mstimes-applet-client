// pages/hsitory/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList: [],
    classifies: [],
    selectClassify: 1,
    loadedCounts: 0,
    totalCounts: 0,
    pageNum: 0,
    pageSize: 20,
    userNumber: 0,
    localStarMap: [],
  },
  //确认搜索提交
  formSubmit:function (e) {
    var that =this;
    var formData = e.detail.value.id;//获取表单所有name=id的值 
    console.log(formData)
    // wx.request({
    //   url:'http://localhost/2018-5-24/search.php?id=' + formData,
    //   data: formData,
    //   header: {'Content-Type':'application/json' },
    //   success:function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       re: res.data,
    //     })
    //     wx.showToast({
    //       title:'已提交',
    //       icon:'success',
    //       duration: 2000
    //     })
    //   }
    // })
  },

  //分类搜索
  classifyButtonSearch:function(e){
    console.log('classify' + e.currentTarget.dataset.classify);
    this.setData({
      selectClassify: e.currentTarget.dataset.classify,
      goodList: [],
      pageNum: 0,
      pageSize: 5,
      loadedCounts: 0
    })
    this.getTotalCounts();
    this.loadGoodList();
  },
  //  加购
  star_click:function(){
    console.log("star add 1")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    this.setData({
      userNumber: loginInfo.userNumber,
    })

    this.getClassifyList();
    this.loadGoodList();
    this.getTotalCounts();
  },

  loadGoodList: function (){
    var _this = this; 

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/goods/queryGoodsByClassify",
      data: {
        "classify": this.data.selectClassify,
        "userNumber": this.data.userNumber,
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
            goodList: goodListTemp.concat(curDataList),
            loadedCounts: this.data.loadedCounts + curDataList.length,
          })
        }
      }
    })
  },

  getClassifyList: function (){
    var _this = this; 
    var getClassifyListUrl = "https://server.ghomelifevvip.com/goods/queryGoodClassifyList";
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: getClassifyListUrl,
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          _this.setData({
            classifies: res.data.dataList,
          })
        }
      }
    })
  },

  getTotalCounts: function (){
    var _this = this; 
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/goods/queryTotalCountsByClassify",
      data: {
        "classify": this.data.selectClassify,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          _this.setData({
            totalCounts: res.data.dataList[0],
          })
        }
      }
    })
  },

  addStar: function (e) {
    let id = e.currentTarget.dataset.id
    var curGoodList = this.data.goodList;
    curGoodList[id].wishGood = true;
    var goodId = curGoodList[id].goodId;
    this.sendChangeStar(1, goodId);

    this.setData({
      goodList: curGoodList
    })
  },

  subtractStar: function (e) {
    let id = e.currentTarget.dataset.id
    var curGoodList = this.data.goodList;
    curGoodList[id].wishGood = false;
    var goodId = curGoodList[id].goodId;
    this.sendChangeStar(2, goodId);

    this.setData({
      goodList: curGoodList
    })
  },

  sendChangeStar: function (type, goodId) {
    console.log('type ---- goodId ' + type + ',' + goodId);

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/goods/changeStarList",
      data: {
        "type": parseInt(type),
        "goodId": parseInt(goodId),
        "userNumber": this.data.userNumber,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('change star success.')
        }
      }
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
    if(getServiceLoginInfo.userNumber == null){
      //跳转到登录页
      wx.redirectTo({
        url: "/pages/login/login?originPage=history"
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
    if(this.data.loadedCounts < this.data.totalCounts){
      this.data.pageNum += 1;
      this.loadGoodList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})