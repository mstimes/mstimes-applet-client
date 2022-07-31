const app = getApp()

Page({
  data: {
    brandList: [],
    swiperIndex: 0
  },

  onLoad: function(options){
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/brand/queryBrandInfos",
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log(res.data.dataList)
          this.setData({
            brandList: res.data.dataList
          })
        }
      }
    })
  },

  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },

  // swiperClick: function(){
  //   // wx.navigateTo({
  //   //   url: `${'/pages/detail/detail?id=' + this.data.imgDaysUrls[this.data.swiperIndex].goodId}`,
  //   // })
  //   const that = this;
  //   that.setData({
  //     swiperIndex: this.data.swiperIndex,
  //   })
  // }
})