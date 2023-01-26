var app=getApp()

Page({
  data:{
    inputMarketName: '',
    inputContactPhone: '',
    inputContactName: '',
    inputContactWx: '',
    latitude: 0,
    longitude: 0,
    locationName: '',
    locationAddress: '',
    unionid: ''
  },
 
  onLoad:function(options){
    this.serviceLogin();

    wx.getLocation({
      // wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      type: 'gcj02',
      //获取位置成功
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      //获取位置失败
      fail: function (err) {
        console.log("获取位置信息失败，请返回重试")
      },
      //接口调用结束的回调函数（调用成功、失败都会执行）
      complete: function (info) {
        console.log("完成")
      },
    })
  },

  serviceLogin(){
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    this.setData({
      unionid: wechatAuthSession.unionid
    })
    console.log('unionid ' + this.data.unionid);

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/user/login',
      data: {
        loginType: 1,
        loginId: wechatAuthSession.unionid
      },
      complete: res => {
        console.log(res)
        if(res.data.success){
          console.log('agent login auditStatus ' + res.data.dataList[0].auditStatus);
          if(res.data.dataList[0].level == 10){
            wx.navigateTo({
              url: '/pages/market/register_page/register_result?auditStatus=' + res.data.dataList[0].auditStatus,
            })          
          }
        }else {
          console.log('err msg ' + res.data.msg);
        }
      }
    })
  },

  bindMarketNameInput: function(e){
    console.log('input market name ' + e.detail.value);
    this.setData({
      inputMarketName: e.detail.value
    })
  },

  bindContactPhoneInput: function(e){
    console.log('input contact phone ' + e.detail.value);
    this.setData({
      inputContactPhone: e.detail.value
    })
  },

  bindContactNameInput: function(e){
    console.log('input contact name ' + e.detail.value);
    this.setData({
      inputContactName: e.detail.value
    })
  },

  bindContactWxInput:function(e){
    console.log('input contact wx ' + e.detail.value);
    this.setData({
      inputContactWx: e.detail.value
    })
  },

  navRoad: function(e){
    console.log('nav road...');
    wx.chooseLocation({
      success: (res) => {
         this.setData({
           longitude: res.longitude,
           latitude:  res.latitude,
           locationName: res.name,
           locationAddress: res.address,
         })
       },
       fail: function () {
       },
       complete: function () {
       }
   })
  },

  nextTap(){
    if(this.data.inputMarketName == ''){
      wx.showToast({
        title: '请填写店铺名称',
        icon: 'error'
      })
      return;
    } else if(this.data.locationAddress == ''){
      wx.showToast({
        title: '请填写店铺位置信息',
        icon: 'error'
      })
      return;
    } else if(this.data.inputContactPhone == ''){
      wx.showToast({
        title: '请填写手机号',
        icon: 'error'
      })
      return;
    }else if(this.data.inputContactName == ''){
      wx.showToast({
        title: '请填写店主姓名',
        icon: 'error'
      })
      return;
    }

    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/user/registerMarket",
      data: {
        "unionId": this.data.unionid,
        "marketName": this.data.inputMarketName,
        "locationName": this.data.locationName,
        "locationAddress": this.data.locationAddress,
        "contactPhone": this.data.inputContactPhone,
        "contactName": this.data.inputContactName,
        "contactWx": this.data.inputContactWx,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
          wx.showToast({
            title: '系统报错！',
            icon: 'error'
          })
          return;
        }else {
          console.log('register market success.');
          wx.navigateTo({
            url: '/pages/market/register_page/register_result?auditStatus=1',
          })
        }
      }
    });
  },

  getWxPermission(){
    wx.getUserProfile({
      desc: '用于开通商家店铺', 
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        console.log(res.userInfo)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'https://server.ghomelifevvip.com/wechat/queryAuthSession',
            data: {
              code: res.code
            },
            success: res => {
              if(res.data.success){
                console.log('res ' + res.data.dataList[0].unionid)
                wx.setStorageSync('wechatAuthSession', res.data.dataList[0])
              }else{
                wx.showToast({
                  title: '微信授权网络请求失败',
                  icon: 'error'
                })
              }
            },
            fail: res => {
              if (res == null || res.data == null){
                wx.showToast({
                  title: '微信授权网络请求失败',
                  icon: 'error'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'error'
          })
        }
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
    
})