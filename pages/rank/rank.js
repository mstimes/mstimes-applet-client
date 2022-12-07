Page({
  data: {
    imgDaysUrls: [],
    swiperIndex: 0,
    monthlyImgUrls: [],
  },

  onLoad: function (options){
    var todayUrl = "https://server.ghomelifevvip.com/goods/queryGoodsRankByType?rankType=1";
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
          var mainList = res.data.dataList;
          for (var i = 0; i < mainList.length; i++){
            mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
          }
          // console.log(mainList)
          this.setData({
            imgDaysUrls: mainList,
          })
        }
      }
    })

    var todayUrl = "https://server.ghomelifevvip.com/goods/queryGoodsRankByType?rankType=2";
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
          var mainList = res.data.dataList;
          for (var i = 0; i < mainList.length; i++){
            mainList[i].mainImage = "https://ghomelifevvip.com/" + mainList[i].mainImage;
          }
          console.log(mainList)
          this.setData({
            monthlyImgUrls: mainList,
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

  swiperClick: function(){
    wx.navigateTo({
      url: `${'/pages/detail/detail?id=' + this.data.imgDaysUrls[this.data.swiperIndex].goodId}`,
    })
  }
})