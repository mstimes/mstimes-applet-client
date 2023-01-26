var app=getApp()
const order = ['demo1', 'demo2', 'demo3']
Page({
 data:{
  header: {
    // "bg_color": "orange",
    "color": "#000",
    "flag": 1,
    "name": "会员中心"
  },
  currentTab:0,
  swiperCurrent:0,
  toView: 'green',
  privileges : ["SILVER", "PLATINUM"],
  consumePrice: 0,
  vipLevel: 1,
 },

 onLoad:function(options){
  var myDate = new Date();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate() + 1;
  var loginInfo = wx.getStorageSync('serviceLogin');
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
          vipLevel: res.data.dataList[0].level,
          currentTab: res.data.dataList[0].level-1
        })
      }else{
        console.error('获取总金额失败！')
      }
    }
  });
 },
 //滑动切换
 swiperTab:function( e ){
  var that=this;
  that.setData({
   currentTab:e.detail.current
  });
 },
 //点击切换
 clickTab: function( e ) { 
  
  var that = this; 
  
  if( this.data.currentTab === e.target.dataset.current ) { 
   return false; 
  } else { 
   that.setData( { 
    currentTab: e.target.dataset.current 
   }) 
  } 
 },

  getCurrentNumberAge(e){  //年龄
    console.log('获取当前current值年龄',e,e.detail.current)

    let result = e.detail.current;
    this.setData({
      age:result 
    })
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },

  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  swiperTab:function( e ){
    var that=this;
    that.setData({
      swiperCurrent: e.detail.current,
    });
  },
})


