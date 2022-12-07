// pages/order/order.js
Page({
  data: {
    showAddress: false,
    receiverName: '',
    receiverPhone: 0,
    receiverAddress: '',
    imageUrl: '',
    goodId: 0,
    globalTitle: '',
    groupPrice: 0,
    selectedClassify: '',
    selectedSpecific: '',
    num: 1,
    sumPrice: 0,
    couponCode: '',
    mbeansCounts: 0,
    outTradeNo: '',
    classifyId: -1,
    specificId: -1,
    lastClickTime: 0,
    goodType: 0,
    needRealName: false,
    tax: 0,
    couponCategory: '',
    discountCoupon: 0,
    couponSize: 0,
    header: {
      "color": "#000",
      "flag": 1,
      "name": "订单结算"
    },
    orderRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var discountCoupon = wx.getStorageSync('selectedDiscountCoupon');
    var couponCategory = wx.getStorageSync('selectedCouponCategory');
    if(discountCoupon > 0){
      this.setData({
        discountCoupon: discountCoupon,
        couponCategory: couponCategory,
      });
    }else {
      var orderRecords = wx.getStorageSync('bucketToOrderRecords');

      this.setData({
        orderRecords: orderRecords,
        sumPrice: options.sumPrice
      });
  
      this.getRealNameIdentifyInfo();
      this.getUserCouponInfo();
  
      var loginInfo = wx.getStorageSync('serviceLogin');
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/user/queryLastUsualAddress',
        data: {
          "userNumber": loginInfo.userNumber,
        },
        complete: res=>{
          if(res.data.success){
            console.log('存在常用地址 ' + res.data.dataList[0])
            // 渲染常用地址信息
            this.setData({
              showAddress: true,
              receiverName: res.data.dataList[0].name,
              receiverPhone: res.data.dataList[0].phoneNo,
              receiverAddress: res.data.dataList[0].address,
            });
          }else{
            console.error('不能存在常用地址 ' + res.data.msg)
          }
        }
      })
    }

    // var sumPrice = options.groupPrice * options.num;
    // console.log('sumPrice ' + sumPrice);
    // console.log('num ' + options.num);
    // if(parseFloat(options.tax) > 0){
    //   sumPrice = parseFloat(sumPrice) + parseFloat(options.tax);
    //   console.log('sumPrice include tax ' + sumPrice);
    // }
    // if(sumPrice.toString().indexOf(".") < 0){
    //   sumPrice = sumPrice + ".00"
    // }else {
    //   sumPrice = sumPrice + "0"
    // }
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
    this.onLoad();
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
    wx.setStorageSync('selectedDiscountCoupon', 0);
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

  },

  getAddressButtonTap: function(){
    var _this = this; 
    if(wx.chooseAddress){
      wx.chooseAddress({
        fail: function(err){
          wx.showToast({
            icon: 'error',
            title: err,
          })
         },
        success (res) {
          _this.setData({
            showAddress: true,
            receiverName: res.userName,
            receiverPhone: res.telNumber,
            receiverAddress: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo
          });
        },
        complete(res){
          console.log("complete.");
          // 保存最新地址信息
          var loginInfo = wx.getStorageSync('serviceLogin');
          wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            url: 'https://server.ghomelifevvip.com/user/createUsualAddress',
            data: {
              "userNumber": loginInfo.userNumber,
              "phoneNo": res.telNumber,
              "name": res.userName,
              "address": res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo,
            },
            complete: res=>{
              if(res.data.success){
                console.log('保存常用地址成功！' + res.data.dataList[0])
              }else{
                console.error('保存常用地址失败！' + res.data.msg)
              }
            }
          });
        }
      })
    }else {
      wx.showToast({
        icon: 'error',
        title: '当前微信版本不支持',
      })
    }
  },

  paymentButtonTap: function(){
    var myDate = Date.now();
    var clickTimeInterval = myDate - this.data.lastClickTime;
    if(clickTimeInterval < 2000){ // 两次点击间隔控制在2s以上
      return;
      // wx.showToast({
      //   icon: 'error',
      //   title: '手速太猛了哦',
      // })
    }
    // 更新上次点击时间
    this.data.lastClickTime = myDate;

    console.log('this.data.needRealName ' + this.data.needRealName);
    if(this.data.needRealName){
      console.log('this.data.needRealName ====' + this.data.needRealName);
      this.showModal()
    }else if(!this.data.showAddress){
      wx.showToast({
        icon: 'error',
        title: '请填写收件地址',
      })
    }else{
      var loginInfo = wx.getStorageSync('serviceLogin');
      wx.request({
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/order/uploadOrderInfo',
        data: {
          "uploadOrderInfos": JSON.stringify(this.data.orderRecords),
          "userNumber": loginInfo.userNumber,
          "person": this.data.receiverName,
          "telNumber": this.data.receiverPhone,
          "address": this.data.receiverAddress,
          "couponCode": this.data.couponCode,
          // "goodId": this.data.goodId,
          // "mbeanCounts": this.data.mbeansCounts,
          // "classify": this.data.selectedClassify,
          // "specific": this.data.selectedSpecific,
          // "selectNum": this.data.num,
          // "classifyId": this.data.classifyId,
          // "specificId": this.data.specificId,
        },
        complete: res=>{
          if(res.data.success){
            console.log('下单成功 ' + res.data.dataList[0])
            this.callWxPayment(res.data.dataList[0]);
  
          }else{
            console.error('下单失败 ' + res.data.msg)
            wx.showToast({
              icon: 'error',
              title: res.data.msg,
            })
          }
        }
      })
    }
  },

  callWxPayment: function(outTradeNo){
    var _this = this; 
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/pay/queryPrepayOrderForApplet',
      data: {
        "outTradeNo" : outTradeNo,
        "goodName": this.data.globalTitle,
        "totalFee": this.data.groupPrice * this.data.num,
        "openId": wechatAuthSession.openid,
      },
      complete: res=>{
        if(res.data.success){
          console.log('获取预支付信息成功 ' + res.data.dataList[0])
          console.log('获取预支付信息成功 ' + res.data.dataList)
          var prepayResponse = res.data.dataList[0];
          // 调用微信支付
          wx.requestPayment({
            timeStamp: prepayResponse.timestamp,
            nonceStr: prepayResponse.nonceStr,
            package: prepayResponse.pack,
            signType: 'MD5',
            paySign: prepayResponse.sign,
            success (res) {
              console.log('调用微信支付成功！')
              wx.redirectTo({
                url: "/pages/order/result/result_page?paymentSuccess=1&orderNumber=" + outTradeNo + "&sumPrice=" + _this.data.sumPrice
              })
            },
            fail (res) {
              console.log('调用微信支付失败！')
              wx.redirectTo({
                url: "/pages/order/result/result_page?paymentSuccess=0&orderNumber=" + outTradeNo + "&sumPrice=" + _this.data.sumPrice
              })
            }
          })
        }else{
          console.error('调用预支付接口失败... ' + res.data.msg)
        }
      }
    })
  },

  getRealNameIdentifyInfo: function () {
    var hasRealName = wx.getStorageSync('hasRealName')
    var loginInfo = wx.getStorageSync('serviceLogin');
    console.log('goodType ==== ' + this.data.goodType + ", hasRealName " + hasRealName)
    if(this.data.goodType == 1 && hasRealName == ''){
      console.log('hasRealName ====== ' + hasRealName)
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/user/queryRealNameIdentifyInfo',
        data: {
          "userNumber": loginInfo.userNumber
        },
        complete: res=>{
          if(!res.data.success){
            console.log(res.data.msg)
            this.setData({
              needRealName: true
            })
          }else{
            console.log('res.data.dataList[0] ' + res.data.dataList[0]);
            if(res.data.dataList[0] != null){
              wx.setStorageSync('hasRealName', true)
              this.setData({
                needRealName: false
              })
            }else {
              this.setData({
                needRealName: true
              })
            }
          }
        }
      })
    }
  },

  getUserCouponInfo: function () {
    var loginInfo = wx.getStorageSync('serviceLogin');
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate() + 1;
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: 'https://server.ghomelifevvip.com/coupon/queryAllUserCoupons',
      data: {
        "userNumber": loginInfo.userNumber,
        "goodId": 0,
        "status": 1,
        "pageNum": 0,
        "pageSize": 20
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          if(res.data.dataList[0] != null){
            this.setData({
              couponSize: res.data.dataList.length
            })
          }
        }
      }
    })
  },

    //显示对话框
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    //隐藏对话框
    closeRealNameModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },

    realNameSubmmitForm: function(data) {
      var username = data.detail.value.username;
      var idcardNumber = data.detail.value.idcardNumber;
      console.log('length ' + idcardNumber.toString().length);
      if(username == ''){
        wx.showToast({
          icon: 'error',
          title: '请填写姓名',
        })
      }else if(idcardNumber == ''){
        wx.showToast({
          icon: 'error',
          title: '请填身份证',
        })
      }else if(idcardNumber.toString().length != 18){
        wx.showToast({
          icon: 'error',
          title: '身份证错误',
        })
      }else {
        console.log(data.detail.value)
        var loginInfo = wx.getStorageSync('serviceLogin');
        // 提交实名信息
        wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          url: 'https://server.ghomelifevvip.com/user/createRealNameIdentifyInfo',
          data: {
            "userNumber": loginInfo.userNumber,
            "userName": username,
            "idcard": idcardNumber,
          },
          complete: res=>{
            if(res.data.success){
              console.log('保存实名信息成功！' + res.data.dataList[0])
              // 保存实名信息状态
              wx.setStorageSync('hasRealName', true)
              this.setData({
                needRealName: false
              })
              this.closeRealNameModal();
              wx.showToast({
                icon: 'info',
                title: '保存成功',
              })
            }else{
              console.error('保存实名信息失败！' + res.data.msg)
              wx.showToast({
                icon: 'error',
                title: '保存失败',
              })
              this.setData({
                needRealName: true
              })
            }
          }
        })
      }
    },
    goSelectCouponTap: function(){
      wx.navigateTo({
        url: "/pages/coupon/select/couponList"
      })
    }
})