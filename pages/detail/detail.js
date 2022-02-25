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
    groupPrice: '0.00',
    selectedClassifyId: 0,
    selectedClassify: '',
    selectedSpecificId: 0,
    selectedSpecific: '',
    num: 1,
    minusStatus: 'disabled',
    diffPriceType: 0,
    diffPriceMap: '',
    initSelectClassifyButton: true,
    initSelectSpecificButton: true,
    isHistory: false,
    goodType: 0,
    tax: 0
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
    // console.log(this.data.swiperCurrent);
    wx.switchTab({
      url: this.data.links[this.data.swiperCurrent]
    })
  },

  onReady: function (){
    this.checkLoginBeforeLoad();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
    if(getServiceLoginInfo.userNumber == null){
      wx.hideShareMenu()
    }
  },
  // 分享
  onShareAppMessage: function () {
    var wechatAuthSession = wx.getStorageSync('wechatAuthSession')
    return {
      title: this.data.globalTitle,
      desc: this.data.globalDetail,
      imageUrl: this.data.globalImageUrl,
      path: '/pages/detail/detail?id=' + this.data.globalId + '&shareUser=' + wechatAuthSession.unionid
    }
  },
  // 事件处理函数
  onLoad: function(options){
    var _this = this;

    if(options.scene != null){
      wx.showToast({
        icon: 'error',
        title: 'd.o.s:' + options.scene,
      })
      var sceneArr = options.scene.split('MSMSMS');
      wx.showToast({
        icon: 'error',
        title: 'sceneArr0 :' + sceneArr[0],
      })
      wx.showToast({
        icon: 'error',
        title: 'sceneArr1 :' + sceneArr[1],
      })
      _this.setData({
        globalId: parseInt(sceneArr[1]), 
        isHistory: false,
      })
      wx.setStorageSync('shareUser',sceneArr[0])
    } else{
      _this.setData({
        globalId: options.id, 
        isHistory: options.isHistory,
      })
    }

    if (this.data.globalId != ""){
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        url: 'https://server.ghomelifevvip.com/goods/queryGoodById',
        data: {
          "goodId": this.data.globalId
        },
        complete: res=>{
          if(!res.data.success){
            console.error(res.data.msg)
          }else{
            console.log(res.data.dataList)
            var detailList = res.data.dataList[0];
            console.log('detailList.diffPriceInfo ---- ' + detailList.diffPriceInfo)

            var diffPriceMap = this.objToStrMap(JSON.parse(detailList.diffPriceInfo));
            _this.setData({
              globalTitle: detailList.title, 
              globalDetail: detailList.description,
              groupPrice: detailList.groupPrice,
              diffPriceType: detailList.diffType,
              diffPriceMap: diffPriceMap,
              goodType: detailList.type,
              tax: detailList.tax == null ? 0 : detailList.tax,
             })

            // 获取商品分类/规格信息
            var classifyList = JSON.parse(detailList.categories);
            var specificList = JSON.parse(detailList.specifics);
            var classifyButtonsTmp = [];
            var specificButtonsTmp = [];
            for(var i = 0 ; i < classifyList.length ; i++){
              classifyButtonsTmp.push({id:i, name : classifyList[i]});
            }
            for(var i = 0 ; i < specificList.length ; i++){
              specificButtonsTmp.push({id:i, name : specificList[i]});
            }
            _this.setData({
              classifyButtons: JSON.parse(JSON.stringify(classifyButtonsTmp)),
              specificButtons: JSON.parse(JSON.stringify(specificButtonsTmp))
            })
            // 初始化选择按钮
            _this.data.classifyButtons[0].checked = true;
            _this.data.specificButtons[0].checked = true;
            this.setData({
              selectedClassify: this.data.classifyButtons[0].name,
              selectedClassifyId: 1,
              selectedSpecific: this.data.specificButtons[0].name,
              selectedSpecificId: 1,
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
            // console.log(res.data.dataList)
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

  checkLoginBeforeLoad: function () {
      var getSceneInfo = wx.getStorageSync('scene')
      var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
      if(getSceneInfo == '' && getServiceLoginInfo.userNumber == null){
        //跳转到登录页
        wx.redirectTo({
          url: "/pages/login/login?originPage=detail&id=" +  this.data.globalId
        })
      }
  },

  checkLoginForPay: function () {
    var getSceneInfo = wx.getStorageSync('scene')
    var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
    if(getSceneInfo != '' && getServiceLoginInfo.userNumber == null){
      //跳转到登录页
      wx.redirectTo({
        url: "/pages/login/login?originPage=detail&id=" +  this.data.globalId
      })
    }
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
      if(this.data.diffPriceType == 1){
        let classifyKey = id + 1;
        if(this.data.diffPriceMap.get(classifyKey.toString()) != undefined){
          var diffGroupPrice = this.data.diffPriceMap.get(classifyKey.toString()).get("groupPrice");
          // console.log('diffGroupPrice : ' + diffGroupPrice)
          this.setData({
            groupPrice: diffGroupPrice
          })
        }else {
          this.setData({
            groupPrice: this.data.detailRotateImages[0].groupPrice
          })
        }
      }else if(this.data.diffPriceType == 3){
        let classifyKey = id + 1;
        let mergeKey = classifyKey.toString() + this.data.selectedSpecificId.toString();
        console.log('mergeKey ' + mergeKey.toString());
        if(this.data.diffPriceMap.get(mergeKey.toString()) != undefined){
          var diffGroupPrice = this.data.diffPriceMap.get(mergeKey.toString()).get("groupPrice");
          this.setData({
            groupPrice: diffGroupPrice
          })
        }else {
          this.setData({
            groupPrice: this.data.detailRotateImages[0].groupPrice
          })
        }
      }

      if (this.data.classifyButtons[i].id == id) {
        this.data.classifyButtons[i].checked = true;
        this.setData({
          selectedClassify: this.data.classifyButtons[i].name,
          selectedClassifyId: id + 1,
          initSelectClassifyButton: false,
        })
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
      // console.log('======= diffPriceType ' + this.data.diffPriceType);

      if(this.data.diffPriceType == 2){
        let specificKey = id + 1;
        if(this.data.diffPriceMap.get(specificKey.toString()) != undefined){
          var diffGroupPrice = this.data.diffPriceMap.get(specificKey.toString()).get("groupPrice");
          // console.log('======= diffGroupPrice ' + diffGroupPrice.getString());
          this.setData({
            groupPrice: diffGroupPrice
          })
        }else {
          // console.log('------- diffGroupPrice ' + this.data.diffPriceMap.get(specificKey.toString()));
          this.setData({
            groupPrice: this.data.detailRotateImages[0].groupPrice
          })
        }
      }else if(this.data.diffPriceType == 3){
        let specificKey = id + 1;
        let mergeKey = this.data.selectedClassifyId.toString() + specificKey.toString();
        console.log('mergeKey ' + mergeKey.toString());
        if(this.data.diffPriceMap.get(mergeKey.toString()) != undefined){
          var diffGroupPrice = this.data.diffPriceMap.get(mergeKey.toString()).get("groupPrice");
          this.setData({
            groupPrice: diffGroupPrice
          })
        }else {
          this.setData({
            groupPrice: this.data.detailRotateImages[0].groupPrice
          })
        }
      }

      if (this.data.specificButtons[i].id == id) {
        this.data.specificButtons[i].checked = true;
        this.setData({
          selectedSpecific: this.data.specificButtons[i].name,
          selectedSpecificId: id + 1,
          initSelectSpecificButton: false,
        })
      }
      else {
        this.data.specificButtons[i].checked = false;
      }
    }
    this.setData({
      specificButtons: this.data.specificButtons,
    })
  },

  doBuyButtonTap: function() {
    this.checkLoginForPay();

    if(this.data.selectedClassify == ''){
      wx.showToast({
        icon: 'error',
        title: '请选择分类',
      })
    }else if(this.data.selectedSpecific == ''){
      wx.showToast({
        icon: 'error',
        title: '请选择规格',
      })
    }else {
      wx.navigateTo({
        url: "/pages/order/order?imageUrl=" + this.data.globalImageUrl
         + "&goodId=" + this.data.globalId
         + "&globalTitle=" + this.data.globalTitle
         + "&groupPrice=" + this.data.groupPrice
         + "&selectedClassify=" + this.data.selectedClassify
         + "&selectedSpecific=" + this.data.selectedSpecific
         + "&num=" + this.data.num
         + "&classifyId=" + this.data.selectedClassifyId
         + "&specificId=" + this.data.selectedSpecificId
         + "&goodType=" + this.data.goodType
         + "&tax=" + this.data.tax
      })
    }
  },

  /* 点击减号 */
	bindMinus: function() {
		var num = this.data.num;
		// 如果大于1时，才可以减
		if (num > 1) {
			num --;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		// 将数值与状态写回
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},
	/* 点击加号 */
	bindPlus: function() {
		var num = this.data.num;
		// 不作过多考虑自增1
		num ++;
		// 只有大于一件的时候，才能normal状态，否则disable状态
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		// 将数值与状态写回
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},
	/* 输入框事件 */
	bindManual: function(e) {
		var num = e.detail.value;
		// 将数值与状态写回
		this.setData({
			num: num
		});
  },
  
  objToStrMap: function(obj){
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      console.log('k --- ' + k)
      let subMap = new Map();
      for (let kk of Object.keys(obj[k])) {
        subMap.set(kk, obj[k][kk])
      }
      strMap.set(k, subMap);
    }

    return strMap;
  },

  sendChangeStar: function () {
    var loginInfo = wx.getStorageSync('serviceLogin');
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/goods/changeStarList",
      data: {
        "type": 1,
        "goodId": parseInt(this.data.globalId),
        "userNumber": loginInfo.userNumber,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          wx.showToast({
            title: '已加入心愿单',
          })
        }
      }
    })
  },
})

