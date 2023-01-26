const order = ['demo1', 'demo2', 'demo3']
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scenesMap: [{}],
    subClassifys: [{}],
    topicTypes: [],
    selectTopicId: 0,
    userNumber: 0,
    currentTab: 0,
    swiHeight: 108,
    currentSubClassify: 0,
    goodList: [],
    loadedCounts: 0,
    totalCounts: 0,
    pageNum: 0,
    pageSize: 5,
    isTriggered: true,
    topicButtonId: 'topic0',
    classifyButtons: [{}],
    specificButtons: [{}],
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
    show: false,
    isShowBucket: 0,
    addBucketIndex: 0,
    globalId: 0,
    marketName: ''
  },

  //分类搜索
  topicButtonSearch:function(e){
    console.log('currentTab' + e.currentTarget.dataset.classify);
    console.log('current classify' + this.data.topicTypes[e.currentTarget.dataset.classify].topicId);
    this.setData({
      currentTab: e.currentTarget.dataset.classify,
      selectTopicId: this.data.topicTypes[e.currentTarget.dataset.classify].topicId,
      subClassifys: this.data.scenesMap[this.data.topicTypes[e.currentTarget.dataset.classify].topicId],
      goodList: [],
      currentSubClassify: 0,
      loadedCounts: 0,
      pageNum: 0
    })
    this.loadGoodList(this.data.selectTopicId);
  },

  subClassifyButtonSearch:function(e){
    console.log('sub classify ' + e.currentTarget.dataset.subclassify);
    this.setData({
      currentSubClassify: e.currentTarget.dataset.subclassify,
      goodList: [],
      loadedCounts: 0,
      pageNum: 0
    })
    console.log('selectTopicId ' + this.data.selectTopicId + ', currentTab ' + this.data.currentTab);
    this.loadGoodList(this.data.selectTopicId);
  },

  showModalByBucket: function (e) {
    console.log('add bucket index ' + e.currentTarget.dataset.index);
    console.log('add bucket goodid ' + e.currentTarget.dataset.goodid);

    var classifyButtons = JSON.parse(this.data.goodList[e.currentTarget.dataset.index].goodCategories);
    var specificButtons = JSON.parse(this.data.goodList[e.currentTarget.dataset.index].goodSpecifics);

    this.setData({
      globalId: e.currentTarget.dataset.goodid,
      selectedClassifyId: 0,
      selectedSpecificId: 0,
      selectedClassify: classifyButtons[0],
      selectedSpecific: specificButtons[0],
    })

    if(classifyButtons.length == 1 && specificButtons.length == 1){
      this.setData({
        selectedClassify: classifyButtons[0],
        selectedSpecific: specificButtons[0],
        num: 1
      })
      this.addBucketTap();
    }else {
      this.setData({
        isShowBucket: 1,
        addBucketIndex: e.currentTarget.dataset.index,
        classifyButtons: classifyButtons,
        specificButtons: specificButtons,
      })
      this.showModal()
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

  addBucketTap:function(e){
    var loginInfo = wx.getStorageSync('serviceLogin');
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/bucket/addBucketInfo",
      data: {
        "num": this.data.num,
        "goodId": parseInt(this.data.globalId),
        "userNumber": loginInfo.userNumber,
        "specification": this.data.selectedSpecific,
        "classify": this.data.selectedClassify
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          wx.showToast({
            title: '已加入购物袋',
          })
          this.hideModal();
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo = wx.getStorageSync('serviceLogin');
    console.log('toopicid ' + options.topicId)
    if(options.topicId != undefined){
      console.log('options.topicId ' + options.topicId + ', options.tabIndex ' + options.tabIndex)
      this.setData({
        selectTopicId: options.topicId,
        currentTab: options.tabIndex,
        topicButtonId: 'topic' + options.tabIndex,
        userNumber: loginInfo.userNumber,
      })
      console.log('topicButtonId ' + this.data.topicButtonId);
    }else {
      this.setData({
        userNumber: loginInfo.userNumber,
        currentTab: 0,
        topicButtonId: 'topic0',
      })
    }

    var marketName = wx.getStorageSync('marketName');
    this.setData({
      marketName: marketName
    })

    this.getTopicTypeList(options.topicId);
  },

  loadScenesMap: function (topicId){
    var _this = this; 
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/queryAllScenes",
      data: {
        "topicType": 1
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log("res.data.dataList " + res.data.dataList[0][11][0].sceneName)
          console.log("res.data.dataList[0].keys()" + Object.keys(res.data.dataList[0]))
          console.log("subClassifys " + res.data.dataList[0][topicId])
          _this.setData({
            scenesMap: res.data.dataList[0],
            subClassifys: res.data.dataList[0][topicId],
          })
        }
      }
    })
  },

  getTopicTypeList: function (topicId){
    var _this = this; 
    var getTopicTypeListUrl = "https://server.ghomelifevvip.com/topic/queryTopicTypeList";
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: getTopicTypeListUrl,
      data: {
        "type": 1
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('getTopicTypeList set selectTopicId');
          if(topicId == undefined){
            this.loadGoodList(res.data.dataList[0].topicId);
            this.loadGoodCounts(res.data.dataList[0].topicId);
            this.loadScenesMap(res.data.dataList[0].topicId);

            _this.setData({
              topicTypes: res.data.dataList,
              selectTopicId: res.data.dataList[0].topicId
            })
          }else {
            this.loadGoodList(topicId);
            this.loadGoodCounts(topicId);
            this.loadScenesMap(topicId);

            _this.setData({
              topicTypes: res.data.dataList,
              selectTopicId: topicId
            })
          }
        }
      }
    })
  },

  loadGoodList: function (topicId) {
    console.log('topicId ' + topicId + ', currentSubClassify ' + this.data.currentSubClassify);
    var _this = this;
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/querySceneGoodsByTopicScene",
      data: {
        "topicId": topicId,
        "sceneId": this.data.currentSubClassify + 1,
        "pageNum": this.data.pageNum,
        "pageSize": this.data.pageSize,
      },
      complete: res=>{
        var goodListTemp = this.data.goodList;
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          var curDataList = res.data.dataList;
          console.log('curDataList goodCategories ' + curDataList[0].goodCategories);
          console.log('curDataList goodSpecifics ' + curDataList[0].goodSpecifics);
          for (var i = 0; i < curDataList.length; i++){
            curDataList[i].mainImage = "https://ghomelifevvip.com/" + curDataList[i].mainImage;
          }
          _this.setData({
            goodList: goodListTemp.concat(curDataList),
            loadedCounts: this.data.loadedCounts + curDataList.length,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.checkLogin();
  },

  checkLogin: function () {
    var getServiceLoginInfo = wx.getStorageSync('serviceLogin')
    if(getServiceLoginInfo.userNumber == null || getServiceLoginInfo.wxOpenId == null){
      //跳转到登录页
      wx.redirectTo({
        url: "/pages/login/login?originPage=explore"
      })
    }
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
    console.log('onReachBottom... ' + this.data.totalCounts + ', this.data.loadedCounts ' + this.data.loadedCounts);
    // if(this.data.loadedCounts < this.data.totalCounts){
    //   console.log('onReachBottom < ');
    //   this.data.pageNum += 1;
    //   this.loadGoodList(this.data.selectTopicIndex);
    // }else {
    //   console.log('onReachBottom > ');
    //   this.setData({
    //     currentSubClassify: this.data.currentSubClassify + 1,
    //     loadedCounts: 0,
    //     goodList: [],
    //     pageNum: 0
    //   })
    //   this.loadGoodList(this.data.selectTopicIndex);
    // }
  },

   //滑动切换
  swiperTab:function(e){
    if(e.detail.current == 0 || e.detail.current == 1){
      this.setData({
        swiHeight: 108
      })
    }else if(e.detail.current == 2){
      this.setData({
        swiHeight: 145
      })
    }else if(e.detail.current == 3){
      this.setData({
        swiHeight: 85
      })
    }

    var that=this;
    that.setData({
      currentTab: e.detail.current,
      selectTopicId: e.detail.current
    });
  },

  loadGoodCounts: function (topicId){
    var _this = this;
    console.log('topicID ' + topicId + ",sceneID " + (this.data.currentSubClassify + 1));
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      url: "https://server.ghomelifevvip.com/topic/querySceneGoodsCounts",
      data: {
        "topicId": topicId,
        "sceneId": this.data.currentSubClassify + 1,
      },
      complete: res=>{
        if(!res.data.success){
          console.log(res.data.msg)
        }else{
          console.log('res.data.dataList[0] ' + res.data.dataList[0]);
          _this.setData({
            totalCounts: res.data.dataList[0],
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // upper(e) {
  //   console.log('to upper.')
  //   if(this.data.currentSubClassify > 0){
  //     this.setData({
  //       currentSubClassify: this.data.currentSubClassify - 1,
  //       goodList: [],
  //       loadedCounts: 0
  //     })
  //     this.loadGoodList(this.data.selectTopicIndex);
  //   }
  // },

  lower(e) {
    console.log('to lower. loadedCounts ' + this.data.loadedCounts + ', totalCounts ' + this.data.totalCounts)
    if(this.data.loadedCounts < this.data.totalCounts){
      console.log('onReachBottom < ');
      this.data.pageNum += 1;
      this.loadGoodList(this.data.selectTopicId);
    }
    // else {
    //   console.log('onReachBottom > ');
    //   this.setData({
    //     currentSubClassify: this.data.currentSubClassify + 1,
    //     loadedCounts: 0,
    //     goodList: [],
    //     pageNum: 0
    //   })
    //   this.loadGoodList(this.data.selectTopicIndex);
    // }
  },

  handleRefresher(event){
    console.log('handle Refresher');
  },

  scrollBottom: function () {
    console.log('scrollBottom ... ');
    var that = this;
    that.setData({
      bottomId: 'bottomView',
    })
  },

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
    let index = e.currentTarget.dataset.index
    console.log('radioClassifyButtonTap index ' + index);
    this.setData({
      selectedClassifyId: index,
      selectedClassify: this.data.classifyButtons[index],
    })
  },
  radioSpecificButtonTap: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      selectedSpecificId: index,
      selectedSpecific: this.data.specificButtons[index],
    })
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

  goBack : function (){
    wx.navigateBack({
      delta: 1
    });
  }

})

