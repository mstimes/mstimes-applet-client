var app=getApp()
var selectedMap = new Map()
var priceCalculate = 0.00

Page({
 data:{
  currentTab:0,
  header: {
    "color": "#000",
    "flag": 1,
    "name": "购物袋"
  },
  bucketRecords: [],
  x: 0,
  currentX: 0,
  sumPrice: 0,
  items: [],
  startX: 0, //开始坐标
  startY: 0,
  num: 1,
  minusStatus: 'normal',
  orderRecords: []
 },
 onLoad:function(options){
    this.getBucketRecords();
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

 goBuyButtonTap: function() {
   this.data.orderRecords.splice(0, this.data.orderRecords.length);
    var it = selectedMap.keys();
    for(let i = 0 ; i < selectedMap.size ; i++){
      let k = it.next().value;
      this.data.orderRecords.push(selectedMap.get(k));
    }

    wx.setStorageSync('selectedDiscountCoupon', 0);
    wx.setStorageSync('bucketToOrderRecords', this.data.orderRecords)
    wx.navigateTo({
      url: "/pages/order/order?sumPrice=" + priceCalculate
    })
  },

  getBucketRecords() {
    var loginInfo = wx.getStorageSync('serviceLogin');
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/bucket/queryBucketRecords",
      data: {
        "userNumber": loginInfo.userNumber
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('getBucketRecords' + res.data.dataList);
          this.setData({
            bucketRecords: res.data.dataList
          })
        }
      }
    })
  },


  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.bucketRecords.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      bucketRecords: this.data.bucketRecords
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.bucketRecords.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      bucketRecords: that.data.bucketRecords
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }, 

  delTap(e) {
    console.log('delete ' + e.currentTarget.dataset.index);
    var record = this.data.bucketRecords[e.currentTarget.dataset.index];
    this.remove(this.data.bucketRecords, record);
    
    this.deleteBucketRecord(record.goodId);
    if(selectedMap.has(record.brand)){
      priceCalculate = priceCalculate - (record.price * record.num)
    }

    this.setData({
      bucketRecords: this.data.bucketRecords,
      sumPrice: Math.round(priceCalculate * 100) / 100
    })
  },

  remove: function(array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }
    return -1;
  },

  deleteBucketRecord(goodId) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/bucket/deleteBucketInfo",
      data: {
        "userNumber": loginInfo.userNumber,
        "goodId": goodId
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('delete bucket record by goodId ' + goodId)
        }
      }
    })
  },

  selectCheckBox: function(e) {
    this.data.bucketRecords.forEach(function (v, i) {
      if (i == e.currentTarget.dataset.index) {
        if(v.isChecked){
          v.isChecked = false;
        }else {
          v.isChecked = true;
        }
      }
    })

    var changePrice = this.data.bucketRecords[e.currentTarget.dataset.index].price * this.data.bucketRecords[e.currentTarget.dataset.index].num;
    console.log('changePrice ' + changePrice);

    var mapKey = this.data.bucketRecords[e.currentTarget.dataset.index].brand;
    if(selectedMap.has(mapKey)){
      selectedMap.delete(mapKey);

      priceCalculate = this.data.sumPrice - changePrice
    } else {
      selectedMap.set(mapKey, this.data.bucketRecords[e.currentTarget.dataset.index]);

      priceCalculate = this.data.sumPrice + changePrice
    }
    this.setData({
      sumPrice: Math.round(priceCalculate * 100) / 100,
      bucketRecords: this.data.bucketRecords
    });  
  },

  /* 点击减号 */
  bindMinus: function(e) { 
    var goodId = 0;
    var num = 0;

    this.data.bucketRecords.forEach(function (v, i) {
      if (i == e.currentTarget.dataset.index) {
        if (v.num > 1) { 
          num = --v.num;
          goodId = v.goodId;
          if(selectedMap.has(v.brand)){
            priceCalculate = priceCalculate - v.price
          }
        }
      }
    })
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    // var minusStatus = num <= 1 ? 'disabled' : 'normal';
    if(num > 0){
      this.updateNum(goodId, num);
    }

    // 将数值与状态写回 
    this.setData({ 
      bucketRecords: this.data.bucketRecords,
      sumPrice: Math.round(priceCalculate * 100) / 100
      // minusStatus: minusStatus 
    });  

  }, 
  /* 点击加号 */
  bindPlus: function(e) {
    var index = -1;
    var goodId = 0;
    var num = 1;
    this.data.bucketRecords.forEach(function (v, i) {
      if (i == e.currentTarget.dataset.index) {
        num = ++v.num;
        goodId = v.goodId;
        index = i;
        if(selectedMap.has(v.brand)){
          priceCalculate = priceCalculate + v.price
        }
      }
    })
    if(index > 0){
      console.log('goodId ' + goodId + ", num " + num);
      this.updateNum(goodId, num);
    }

    // 只有大于一件的时候，才能normal状态，否则disable状态 
    // var minusStatus = num < 1 ? 'disabled' : 'normal'; 
    // 将数值与状态写回 
    this.setData({ 
      bucketRecords: this.data.bucketRecords,
      sumPrice: Math.round(priceCalculate * 100) / 100
      // minusStatus: minusStatus 
    }); 
  },

  updateNum: function(goodId, num) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/bucket/updateNum",
      data: {
        "userNumber": loginInfo.userNumber,
        "goodId": goodId,
        "num": num,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('update num success.');
        }
      }
    })
  },

  /* 输入框事件 */
  bindManual: function(e) { 
    var num = e.detail.value; 
    // 将数值与状态写回 
    this.setData({ 
      num: num 
    }); 
  },

  doBuyButtonTap() {
    wx.switchTab({
      url: '/pages/explore/explore'
    })
  }
})