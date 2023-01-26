var app=getApp()
var selectedMap = new Map()
var priceCalculate = 0.00

var filters = {
      toFix: function (value) {
          return value.toFixed(2)
      }
  }
  
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
  sumPrice: 0.00,
  items: [],
  startX: 0, //开始坐标
  startY: 0,
  num: 1,
  minusStatus: 'normal',
  orderRecords: [],
  vipLevel: 1,
 },
 
 onLoad:function(options){
  var vipLevel = wx.getStorageSync('vipLevel');
  this.setData({
    vipLevel: vipLevel
  })

  var mapJson = wx.getStorageSync('localSelectedMap');
   if(mapJson != '' && mapJson != undefined){
     console.log('mapJson ' + mapJson);
     var mapJsonToMap = JSON.parse(mapJson);
     var localSelectedMap = this.objToStrMap(mapJsonToMap);
     selectedMap = localSelectedMap;
     if(selectedMap.size == 0){
        console.log('mapJson is not null, selectedMap.size == 0 ,reset localSumPrice zero.');
        wx.setStorageSync('localSumPrice', 0)
     }
   }else {
      console.log('mapJson is null, reset localSumPrice zero.');
      wx.setStorageSync('localSumPrice', 0)
   }

   var localSumPrice = wx.getStorageSync('localSumPrice');
   console.log('localSumPrice ' + localSumPrice + ", priceCalculate " + priceCalculate + ', sumPrice ' + this.data.sumPrice)
   if(localSumPrice != '' && localSumPrice != undefined || localSumPrice == 0){
     console.log('localSumPrice ' + localSumPrice);
     this.setData({
       sumPrice: Math.round(localSumPrice * 100) / 100
     })
     priceCalculate = localSumPrice;
   }

   this.getBucketRecords();
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
         var localBucketRecords = wx.getStorageSync('localBucketRecords');
         if(localBucketRecords != '' && localBucketRecords != undefined){
           localBucketRecords.forEach(function (v, i) {
             if(v.isChecked){
                res.data.dataList.forEach(function (vv, ii) {
                  if(vv.brand == v.brand){
                    vv.isChecked = true;
                  }
                })
              //  updatePriceCalculate += res.data.dataList[i].price * res.data.dataList[i].num;
             }
           })
         }

        //  priceCalculate = updatePriceCalculate;

         this.setData({
           bucketRecords: res.data.dataList,
          //  sumPrice: Math.round(updatePriceCalculate * 100) / 100,
         })
       }
     }
   })
 },

 onShow: function (){
   this.onLoad();
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
     selectedMap.delete(record.brand);
     priceCalculate = priceCalculate - (record.price * record.num)
   }

   this.setData({
     bucketRecords: this.data.bucketRecords,
     sumPrice: Math.round(priceCalculate * 100) / 100
   })

   this.saveLocalSelected();
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

   console.log('selectedMap to JSON change begin ' + JSON.stringify(this.strMapToObj(selectedMap)) + ', map size ' + selectedMap.size);
   if(selectedMap.has(mapKey)){
     selectedMap.delete(mapKey);

     priceCalculate = priceCalculate - changePrice
   } else {
     selectedMap.set(mapKey, this.data.bucketRecords[e.currentTarget.dataset.index]);

     priceCalculate = priceCalculate + changePrice
   }
   console.log('selectedMap to JSON change end ' + JSON.stringify(this.strMapToObj(selectedMap)) + ', map size ' + selectedMap.size);

   this.setData({
     sumPrice: Math.round(priceCalculate * 100) / 100,
     bucketRecords: this.data.bucketRecords
   });  

   this.saveLocalSelected();
 },

 saveLocalSelected() {
   wx.setStorageSync('localSelectedMap', JSON.stringify(this.strMapToObj(selectedMap)));
   wx.setStorageSync('localBucketRecords', this.data.bucketRecords);
   wx.setStorageSync('localSumPrice', this.data.sumPrice);
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

   this.saveLocalSelected();

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
   if(index >= 0){
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

   this.saveLocalSelected();
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

  strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  },

  objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },

  /* 输入框事件 */
  bindManual: function(e) { 
    var num = e.detail.value; 
    // 将数值与状态写回 
    this.setData({ 
      num: num 
    }); 
  },

  goBuyButtonTap: function() {
    if(selectedMap.size == 0){
      wx.showToast({
        icon: 'error',
        title: '请选择至少一件商品去结算',
        duration: 2000
      })
      return
    }

    var globalTitle = '';
    this.data.orderRecords.splice(0, this.data.orderRecords.length);
    var it = selectedMap.keys();
    for(let i = 0 ; i < selectedMap.size ; i++){
      let k = it.next().value;
      this.data.orderRecords.push(selectedMap.get(k));
      if(i == 0){
        globalTitle = selectedMap.get(k).title + "等"
      }
    }

    wx.setStorageSync('selectedDiscountCoupon', 0);
    wx.setStorageSync('bucketToOrderRecords', this.data.orderRecords)
    wx.navigateTo({
      url: "/pages/order/order?sumPrice=" + priceCalculate + "&isBucket=1&globalTitle=" + globalTitle
    })
  },

  doBuyButtonTap() {
    wx.switchTab({
      url: '/pages/explore/explore'
    })
  },

})