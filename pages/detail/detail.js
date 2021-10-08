// detail.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    classifyButtons: [{}],
    specificButtons: [{}],
    detailRotateImages: [],
    current: 0,  //当前所在页面的 index
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    circular: true, //是否采用衔接滑动
    swiperCurrent: 0,
    globalTitle: '',
    globalDetail: '',
    globalId: '', 
    globalImageUrl: '',
    
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
  swipclick: function(e) {
    console.log(this.data.swiperCurrent);
    console.log(6666)
    wx.switchTab({
      url: this.data.links[this.data.swiperCurrent]
    })
  },
  // 分享
  onShareAppMessage: function () {
    // let users = wx.getStorageSync('user');
    return {
      title: this.data.globalTitle,
      desc: this.data.globalDetail,
      imageUrl: this.data.globalImageUrl,
      path: '/pages/detail/detail?id=' + this.data.globalId
    }
  },
  // 事件处理函数
  onLoad: function(options){
    this.data.classifyButtons[0].checked = true;
    this.data.specificButtons[0].checked = true;
    this.setData({
      classifyButtons: this.data.classifyButtons,
      specificButtons: this.data.specificButtons,
    })
    var _this = this; 
    // console.error(options.id)
    //保存分享的详情页ID
    _this.setData({
     globalId: options.id, 
    })
    if (options.id){
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/goods/queryGoodById',
        data: {
          "goodId": options.id
        },
        complete: res=>{
          if(!res.data.success){
            console.error(res.data.msg)
          }else{
            // console.log(res.data.dataList)
            var detailList = res.data.dataList[0];
            //保存分享的标题&描述
            _this.setData({
              globalTitle: detailList.title, 
              globalDetail: detailList.description,
             })
            // 获取商品分类/规格信息
            var classifyList = JSON.parse(detailList.categories);
            var specificList = JSON.parse(detailList.specifics);
            var classifyButtonsTmp = [];
            var specificButtonsTmp = [];
            for(var i = 0 ; i < classifyList.length ; i++){
              classifyButtonsTmp.push({id:i, name : classifyList[i]});
            }
            for(var i = 0 ; i < classifyList.length ; i++){
              specificButtonsTmp.push({id:i, name : specificList[i]});
            }
            _this.setData({
              classifyButtons: JSON.parse(JSON.stringify(classifyButtonsTmp)),
              specificButtons: JSON.parse(JSON.stringify(specificButtonsTmp))
            })

            var detailImagesNews = []
            for(var i = 0; i < detailList.detailImages.length; i++){
              // console.log(detailList.detailImages[i])
              detailImagesNews.push("https://ghomelifevvip.com/" + detailList.detailImages[i])
            }
            res.data.dataList[0].detailImages = detailImagesNews
            var rotateImagesNews = []
            for(var i = 0; i < detailList.rotateImages.length; i++){
              // console.log(detailList.detailImages[i])
              //保存分享的图片
              _this.setData({
                globalImageUrl: "https://ghomelifevvip.com/" + detailList.rotateImages[0], 
               })
              rotateImagesNews.push("https://ghomelifevvip.com/" + detailList.rotateImages[i])
            }
            res.data.dataList[0].rotateImages = rotateImagesNews
            console.log(res.data.dataList)
            _this.setData({
              detailRotateImages:res.data.dataList,
            })
          }
        
        }
      })
    } else {
      console.error("ERROR:goosId is null!!")
    }
  },

  clickme: function () {
    this.showModal();
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
  hideModal: function () {
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
  radioClassifyButtonTap: function (e) {
    let id = e.currentTarget.dataset.id
    for (let i = 0; i < this.data.classifyButtons.length; i++) {
      if (this.data.classifyButtons[i].id == id) {
        this.data.classifyButtons[i].checked = true;
      }
      else {
        this.data.classifyButtons[i].checked = false;
      }
    }
    this.setData({
      classifyButtons: this.data.classifyButtons,
    })
  },
  radioSpecificButtonTap: function (e) {
    let id = e.currentTarget.dataset.id
    for (let i = 0; i < this.data.specificButtons.length; i++) {
      if (this.data.specificButtons[i].id == id) {
        this.data.specificButtons[i].checked = true;
      }
      else {
        this.data.specificButtons[i].checked = false;
      }
    }
    this.setData({
      specificButtons: this.data.specificButtons,
    })
  },
})

