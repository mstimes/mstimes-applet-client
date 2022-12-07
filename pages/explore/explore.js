Page({
  /**
   * 页面的初始数据
   */
  data: {
    scenesMap: [{}],
    topicTypes: [],
    selectTopicIndex: 0,
    userNumber: 0,
    currentTab:0,
  },

  //分类搜索
  topicButtonSearch:function(e){
    console.log('currentTab' + e.currentTarget.dataset.classify);
    this.setData({
      currentTab: e.currentTarget.dataset.classify
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    this.setData({
      userNumber: loginInfo.userNumber,
    })

    this.getTopicTypeList();
    this.loadScenesMap();
  },

  loadScenesMap: function (){
    var _this = this; 
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/queryAllScenes",
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          // console.log("res.data.dataList " + res.data.dataList[0][1][0].sceneMainImage)
          // console.log("res.data.dataList[0].keys()" + Object.keys(res.data.dataList[0]))
          _this.setData({
            scenesMap: res.data.dataList[0],
          })
        }
      }
    })
  },

  getTopicTypeList: function (){
    var _this = this; 
    var getTopicTypeListUrl = "https://server.ghomelifevvip.com/topic/queryTopicTypeList";
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: getTopicTypeListUrl,
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          _this.setData({
            topicTypes: res.data.dataList,
            selectTopicIndex: res.data.dataList[0].topicId
          })
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

   //滑动切换
  swiperTab:function( e ){
    var that=this;
    that.setData({
      currentTab: e.detail.current,
      selectTopicIndex: e.detail.current
    });
  },

//   //点击切换
//  clickTab: function( e ) { 
  
//   var that = this; 
  
//   if( this.data.currentTab === e.target.dataset.current ) { 
//    return false; 
//   } else { 
//    that.setData( { 
//     currentTab: e.target.dataset.current 
//    }) 
//   } 
//  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

