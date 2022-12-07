var app=getApp()
  Page({
  data:{
    currentTab: 0,
    goodList: [],
    pageNum: 0,
    pageSize: 20,
    topicTypes: [],
    titleForEs: '',
    titleForCh: '',
    titleForDesc: '',
    sceneMainImageUrl: '',
    totolCounts: 0,
    loadedCounts: 0,
    topicId: 0,
    sceneId: 0,
    header: {
      "color": "#000",
      "flag": 1,
      "name": "PAI 官方精品店"
    },
  },

  onLoad:function(options){
    this.setData({
      topicId: options.topicId,
      sceneId: options.sceneId,
    })

    this.getTopicSceneInfo(options.topicId, options.sceneId);
    this.loadGoodList(options.topicId, options.sceneId);
    // this.getTopicTypeList();
  },

  getTopicSceneInfo: function (topicId, sceneId){
    var _this = this; 
    var getTopicTypeListUrl = "https://server.ghomelifevvip.com/topic/queryInfosByTopicScene";
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: getTopicTypeListUrl,
      data: {
        "topicId": topicId,
        "sceneId": sceneId,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          _this.setData({
            titleForEs: res.data.dataList[0].sceneTitleForEs,
            titleForCh: res.data.dataList[0].sceneTitleForCh,
            titleForDesc: res.data.dataList[0].sceneTitleForDesc,
            sceneMainImageUrl: res.data.dataList[0].sceneMainImage,
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

  loadGoodList: function (topicId, sceneId){
    var _this = this;
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/querySceneGoodsByTopicScene",
      data: {
        "topicId": topicId,
        "sceneId": sceneId,
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

  loadGoodCounts: function (topicId, sceneId){
    var _this = this;
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/querySceneGoodsCounts",
      data: {
        "topicId": topicId,
        "sceneId": sceneId,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          _this.setData({
            totolCounts: res.data.dataList[0],
          })
        }
      }
    })
  },

  goBack : function (){
    wx.navigateBack({
      delta: 1
    });
  },

  onReachBottom: function () {
    if(this.data.loadedCounts < this.data.totolCounts){
      this.data.pageNum += 1;
      this.loadGoodList(this.data.topicId, this.data.sceneId);
    }
  },
})