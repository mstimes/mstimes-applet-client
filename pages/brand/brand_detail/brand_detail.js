
const app = getApp()

// Page({
//   data :{
//     isShow : true,
//     headshow: 1
//   },

//   // onPageScroll: function (e) {
//   //   let opacity = 0
//   //   if (e.scrollTop <= 400) {
//   //     opacity = e.scrollTop / 400
//   //   } else {
//   //     opacity = 1
//   //   }
//   //   this.setData({
//   //     headshow: opacity
//   //   })
//   // }
//   onPageScroll: function (e) {
//     let opacity = 0
//     if (e.scrollTop <= 400) {
//       opacity = e.scrollTop / 400
//     } else {
//       opacity = 1
//     }
//     this.setData({
//       headshow: opacity
//     })
//   },
// //监听页面滚动
// // onPageScroll:function(e){
// //   console.log("aaa----");
// //   //获取指定元素距离页面顶部的距离
// //   let query = wx.createSelectorQuery();
// //   console.log("aaa" + query);
// //   query.select('#nav').boundingClientRect((rect) =>{
// //       let top = rect.top;
// //       console.log(top);
// //       if(top<=45){  //这个45视情况而定
// //           this.setData({
// //               fixedNav:true
// //           })
// //       }else{
// //           this.setData({
// //               fixedNav: false
// //           })
// //       }
// //   }).exec()
// // },
// })

Page({
  data: {
    txtRealContent: '',
    txtContent: '',
    showMask: false,
    txtHeight: 0,
  },
  textAreaLineChange(e) {
    this.setData({ txtHeight: e.detail.height })
  },
  txtInput(e) {
    this.setData({ txtContent: e.detail.value })
  },
  changeMaskVisible(e) {
    if (!this.data.showMask) {
      // 将换行符转换为wxml可识别的换行元素 <br/>
      const txtRealContent = this.data.txtContent.replace(/\n/g, '<br/>')
      this.setData({ txtRealContent })
    }
    this.setData({ showMask: !this.data.showMask })
  },

})
