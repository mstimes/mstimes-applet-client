let pageY = 0;
Component({
  options: {
    styleIsolation: 'isolated'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    list: [{
        name: '快递',
        selected: 1,
      },
      {
        name: '自提',
        selected: 0
      }
    ],
    animate: {},
    hideModal: false, //模态框的状态  false-隐藏  true-显示
  },
  /**
   * 数据监听
   */
  observers: {
    'show': function(val) {
      if (val) {
        this.showModal()
      } else {
        // this.hideModal()
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 显示遮罩层
    showModal() {
      this.setData({
        hideModal: true
      })
      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      // 先显示背景再执行动画，translateY(0)偏移量为0代表显示默认高度
      setTimeout(() => {
        animation.translateY(0).step()
        this.setData({
          animate: animation.export()
        })
      }, 50)
    },
    // 隐藏遮罩层
    hideModal() {
      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      // 设置为100vh可以确保滚动到底部，可以按照自己的内容高度设置，能够滑到底部即可
      animation.translateY('100vh').step()
      this.setData({
        animate: animation.export(),
      })
      // 先执行动画，再隐藏组件
      setTimeout(() => {
        this.setData({
          hideModal: false
        })
      }, 300)
    },
    // 移动
    touchMove(e) {
      const clientY = e.changedTouches[0].clientY
      if (clientY - pageY > 0 && clientY - pageY > 50) {
        this.hideModal()
      }
    },
    // 触摸开始
    touchStart(e) {
      pageY = e.changedTouches[0].clientY;
    },
    // 选择类型
    changeItem(e) {
      const {
        index
      } = e.currentTarget.dataset
      this.data.list.forEach((e, i) => {
        if (i == index) {
          e.selected = 1
        } else {
          e.selected = 0
        }
      })
      this.setData({
        list: this.data.list
      })
    },
    // 确认
    confirm() {
      this.hideModal()
    },
  }
})