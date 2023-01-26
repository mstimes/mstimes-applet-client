var app=getApp()

Page({
 data:{
    auditStatus: 0
 },
 
 onLoad:function(options){
  console.log('audit status ' + options.auditStatus);
  this.setData({
    auditStatus: options.auditStatus
  })
 },

 nextTap(){
  wx.switchTab({
    url: '/pages/market/main_page/main',
  })
 },
})