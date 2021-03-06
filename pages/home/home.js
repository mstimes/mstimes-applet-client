// home.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'home page 12321',
    imgUrls: [],
    imgDaysUrls: [],
    imgYestodayUrls: [],
    imgMondayUrls: [],
    current: 0,  //当前所在页面的 index
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    circular: true, //是否采用衔接滑动
    swiperCurrent: 0,
    totalOrderRecords: 0,
    homeTodayTitle: '甄选超榜',
    homeTodayDetail: '每日20:00点为您准时更新好物榜单',
    homeYesterdayTitle: '昨日甄选',
    homeYesterdayDetail: '明日20:00即将下架产品',
  },

  //轮播图的切换事件
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function(e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swiperClick: function(e) {
      wx.redirectTo({
        url: `${'/pages/detail/detail?id=' + this.data.imgUrls[this.data.swiperCurrent].goodId}`,
      })
  },
  // 事件处理函数
  onLoad(){
    this.getOrderRecords();
    this.getHomeTitleInfos();

    var _this = this; 
    var todayUrl = "https://server.ghomelifevvip.com/goods/queryGoodsListByType?type=1";
    var yesUrl = "https://server.ghomelifevvip.com/goods/queryGoodsListByType?type=2";
    var mondayUrl = "https://server.ghomelifevvip.com/goods/queryGoodsListByType?type=4";
    //获取今天货物
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url:todayUrl,
      complete: res=>{
        // console.log(res)
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          // console.log(res.data.dataList)
          var topMainList = this.data.imgUrls;
          var mainList = res.data.dataList;
          for (var i = 0; i < mainList.length; i++){
            if (mainList[i].hotSale != 0){
              var object = {
                url:"https://ghomelifevvip.com/" + mainList[i].hotSaleImage,
                goodId:mainList[i].goodId,
              }
              // topMainList.push("https://ghomelifevvip.com/" + mainList[i].mainImage);
              topMainList.push(object);
            }
            mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
          }
          // console.log(mainList)
          _this.setData({
            imgDaysUrls: mainList,
            imgUrls: topMainList
          })
        }
      }
    }),
    //获取昨天货物
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: yesUrl,
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          // console.log(res.data.dataList)
          var yestodayList = res.data.dataList;
          var topMainList = this.data.imgUrls;
          for (var i = 0; i < yestodayList.length; i++){
            yestodayList[i].mainImage = "https://ghomelifevvip.com/" + yestodayList[i].mainImage;
            if (yestodayList[i].hotSale != 0){
              var object = {
                url:"https://ghomelifevvip.com/" + yestodayList[i].hotSaleImage,
                goodId:yestodayList[i].goodId,
              }
              topMainList.push(object);
            }
            
          }
          console.log("yestodayList " + yestodayList)
          console.log("yestodayList size " + yestodayList.length)
          _this.setData({
            imgYestodayUrls: yestodayList,
            imgUrls: topMainList
          })
        }
      }
    }),
    // 获取周一商品列表
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: mondayUrl,
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          var mondayList = res.data.dataList;
          var topMainList = this.data.imgUrls;
          for (var i = 0; i < mondayList.length; i++){
            mondayList[i].mainImage = "https://ghomelifevvip.com/" + mondayList[i].mainImage;
            if (mondayList[i].hotSale != 0){
              var object = {
                url:"https://ghomelifevvip.com/" + mondayList[i].hotSaleImage,
                goodId: mondayList[i].goodId,
              }
              topMainList.push(object);
            }
            
          }
          console.log("mondayList " + mondayList)
          console.log("mondayList size " + mondayList.length)
          _this.setData({
            imgMondayUrls: mondayList,
            imgUrls: topMainList
          })
        }
      }
    })
  },

  getHomeTitleInfos : function () {
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/common/queryHomeTitleInfos',
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          this.setData({
            homeTodayTitle: res.data.dataList[0].todayTitle,
            homeTodayDetail: res.data.dataList[0].todayDetail,
            homeYesterdayTitle: res.data.dataList[0].yesterdayTitle,
            homeTesterdayDetail: res.data.dataList[0].yesterdayDetail,
          })
        }
      }
    })
  },



  //分享右上角功能
  onShareAppMessage: function () {
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    return{
      title: 'Ms · 时代',
      desc: '带你体验视觉与精神的盛宴',
      imageUrl: '/images/about_share.jpg',
      path: '/pages/home/home?shareUser=' + wechatAuthSession.unionid
    }
  },

  goDetail: function(){
    // console.log('/pages/detail/detail?id=' + this.getDate(globleGoodId))
    wx.navigatorTo({
      // url: '/pages/detail/detail?id=' + this.globleGoodId
      url: '/pages/detail/detail?id=119'
    })
  },
  onShow: function () {
    var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
    if(getServiceLoginInfo.userNumber == null){
      wx.hideShareMenu()
    }
  },

  getOrderRecords: function(){
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate() + 1;
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/order/queryOrderRecordsByType',
      data: {
        "userNumber": loginInfo.userNumber,
        "userId": 0,
        "queryType": 3,
        "startTime": '2021-01-01',
        "endTime": myDate.getFullYear() + '-' + month + '-' + day,
        "pageNum": 0,
        "pageSize": 1
      },
      complete: res=>{
        if(res.data.success){
          var records = res.data['dataList'];
          this.setData({
            totalOrderRecords: res.data['pageTotalCount'],
          });
        }else{
          console.error('order info list not exist ' + res.data.msg)
        }
      }
    })
  },

  downloadTap: function() {
    wx.request({
      header: {
        "Content-Type": "application/json;charset-utf-8"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/wechat/queryAppletCodeToken?shareUser=aaa&goodId=10868',
      responseType: 'arraybuffer',
      complete: res=>{
        if(res.data.success){
          console.log("result : " + res.data.dataList[0]);
          // wx.request({
          //   header: {
          //     "Content-Type": "application/json;charset-utf-8"
          //   },
          //   method: "POST",
          //   url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.dataList[0].accessToken,
          //   responseType: 'arraybuffer',
          //   // data: {
          //   //   "scene": 'sharerId',
          //   //   "page": '/pages/hsitory/history',
          //   //   "width": 280,
          //   //   "is_hyaline": true,
          //   // },
          //   complete: res=>{
          //     if(res.data.success){
          //       console.log(res.data);
          //       var base64 = wx.arrayBufferToBase64(res.data);
          //       this.setData({
          //         showImage: "data:image/PNG;base64," + base64,
          //       });
          //     }else{
          //       console.error('order info list not exist ' + res.data.errmsg)
          //     }
          //   }
          // }
          // )
        }else{
          console.error('order info list not exist ' + res.data.errmsg)
        }
      }
    })
  }
})

