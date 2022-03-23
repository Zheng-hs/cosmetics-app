import {
  request
} from "../../request/index.js"

// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "已下单",
        isActive: false
      },
      {
        id: 2,
        value: "已发货",
        isActive: false
      },
      {
        id: 3,
        value: "已收货",
        isActive: false
      },
      {
        id: 4,
        value: "未评价",
        isActive: false
      },
      {
        id: 5,
        value: "已评价",
        isActive: false
      },
      {
        id: 6,
        value: "退款中",
        isActive: false
      },
      {
        id: 7,
        value: "已退款",
        isActive: false
      },
    ],
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data中
    this.setData({
      tabs
    })
  },
  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const {
      index
    } = e.detail;
    //修改原数组
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOrders(index);
  },
  // 获取订单列表
  async getOrders(index) {
    if (index == 0) {
      const res = await request({
        url: "/api/v1/order/searchUserOrder",
        method: 'POST',
        data: {}
      })
      this.setData({
        orders: res.data.map(v => ({
          ...v,
          createTime: new Date(v.createTime).toLocaleString()
        }))
      })
    } else {

      const res = await request({
        url: "/api/v1/order/searchUserOrder",
        method: 'POST',
        data: {
          status: index
        }
      })
      this.setData({
        orders: res.data.map(v => ({
          ...v,
          createTime: new Date(v.createTime).toLocaleString()
        }))
      })
    }
  },

  refund(e) {
    wx.showModal({
      title: '提示',
      content: '是否退款',
      success(res) {
        if (res.confirm) {
          request({
            url: "/api/v1/order/backUp?OrderId=" + e.currentTarget.dataset.id,
            method: "POST"
          }).then(res => {
            wx.showToast({
              title: '已提交申请',
              icon: 'success',
              // 防止用户手抖 疯狂点击按钮
              mask: true,
              success: (result) => {},
              fail: () => {},
              complete: () => {}
            });
          })


        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  confrim(e) {
    request({
      url: '/api/v1/order/update?orderId=' + e.currentTarget.dataset.id+'&status=4',
      method:'POST'
    }).then(res=> {
      this.getOrders(0);
      wx.showToast({
        title: '已确认收货',
        icon: 'success',
        // 防止用户手抖 疯狂点击按钮
        mask: true,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    })
  },
  gostar(e){
    wx.navigateTo({
      url: '/pages/feedback/index?uid=' + e.currentTarget.dataset.uid + '&type=3&id=' + e.currentTarget.dataset.id,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index'
            })
          } else if (res.cancel) {

          }
        }
      })
    }
    // 获取当前的小程序的页面栈-数组 长度最大是10个页面
    // 数组中索引最大 的就是当前页面
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const {
      type
    } = currentPage.options;
    // 激活选中页面标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type-1);
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