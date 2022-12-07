var app=getApp()
Page({
 data:{
  currentTab:0,
  imgLastUpUrls: [],
  imgVipPrivateUrls: [],
  imgVipGroupUrls: [],
  imgVipFreeUrls: [],
  imgs: [],
  header: {
    "color": "#000",
    "flag": 1,
    "name": "PAI"
  },
  swiperCurrent:0,
  goodList: [],
  pageNum: 0,
  pageSize: 20,
  loadedCounts: 0,
  totalCounts: 0
 },
 
 onLoad:function(options){
  var _this = this; 
  this.loadGoodList();
  this.getTotalCounts();
  this.loadImagesOnShowHome();
  this.loadGoodsForVipPrivate();
  this.loadGoodsForVipGroup();
  this.loadGoodsForFree();

  //获取最近上新
  var getLastUpUrl = "https://server.ghomelifevvip.com/goods/queryGoodsListByType?type=1";
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    url: getLastUpUrl,
    complete: res=>{
      if(!res.data.success){
        console.log(res.data.msg)
      }else{
        console.log("res.data.dataList " + res.data.dataList[0])
        var mainList = res.data.dataList;
        for (var i = 0; i < mainList.length; i++){
          mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
        }
        _this.setData({
          imgLastUpUrls: mainList
        })
      }
    }
  })
 },

 loadGoodsForVipPrivate() {
  var getGoodsForVipPrivateUrl = "https://server.ghomelifevvip.com/goods/queryGoodsByType?type=10";
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    url: getGoodsForVipPrivateUrl,
    complete: res=>{
      if(!res.data.success){
        console.log(res.data.msg)
      }else{
        console.log("res.data.dataList " + res.data.dataList[0])
        var mainList = res.data.dataList;
        for (var i = 0; i < mainList.length; i++){
          mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
        }
        this.setData({
          imgVipPrivateUrls: mainList
        })
      }
    }
  })
 },

 loadGoodsForVipGroup() {
  var getGoodsForVipPrivateUrl = "https://server.ghomelifevvip.com/goods/queryGoodsByType?type=11";
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    url: getGoodsForVipPrivateUrl,
    complete: res=>{
      if(!res.data.success){
        console.log(res.data.msg)
      }else{
        console.log("res.data.dataList " + res.data.dataList[0])
        var mainList = res.data.dataList;
        for (var i = 0; i < mainList.length; i++){
          mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
        }
        this.setData({
          imgVipGroupUrls: mainList
        })
      }
    }
  })
 },

 loadGoodsForFree() {
  var getGoodsForVipPrivateUrl = "https://server.ghomelifevvip.com/goods/queryGoodsByType?type=12";
  wx.request({
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    url: getGoodsForVipPrivateUrl,
    complete: res=>{
      if(!res.data.success){
        console.log(res.data.msg)
      }else{
        console.log("res.data.dataList " + res.data.dataList[0])
        var mainList = res.data.dataList;
        for (var i = 0; i < mainList.length; i++){
          mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
        }
        this.setData({
          imgVipFreeUrls: mainList
        })
      }
    }
  })
 },

  swiperAnimationListener:function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  loadGoodList: function (){
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
      url: "https://server.ghomelifevvip.com/goods/queryGoodsByClassify",
      data: {
        "classify": 1,
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

  loadImagesOnShowHome: function (){
    var _this = this; 

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/querySceneImagesOnHomePage",
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          _this.setData({
            imgs: res.data.dataList
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
          console.log('res.data.dataList' + res.data.dataList);
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
        "classify": 1,
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

  onReachBottom: function () {
    if(this.data.loadedCounts < this.data.totalCounts){
      this.data.pageNum += 1;
      this.loadGoodList();
    }
  },

  //滑动切换
  swiperTab:function(e){
    var that=this;
    that.setData({
      swiperCurrent: e.detail.current
    });
  },

  goDetailTap: function(e){
    let goodId = e.currentTarget.dataset.id
    wx.redirectTo({
      url: '/pages/detail/detail?id=' + goodId,
    })
  },

  trialTap() {
    wx.showToast({
      title:'铂金会员专享',
      icon:'error',
      duration: 2000
    })
  }
})