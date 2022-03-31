// pages/active/index.js
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
      title: { // 属性名
        type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
      },
      // 弹窗内容
      content: {
        type: String,
        value: '内容'
      },
      // 弹窗取消按钮文字
      btn_no: {
        type: String,
        value: '取消'
      },
      // 弹窗确认按钮文字
      btn_ok: {
        type: String,
        value: '确定'
      }
    },

  /**
   * 页面的初始数据
   */
  data: {
    people: [],
    goods: [],
    flag: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const active = wx.getStorageSync("try");
    request({
      url: '/api/v1/activity/searchActivityUser',
      method: "POST",
      data: {
        activityId: active[options.index].activityId
      }
    }).then(res => {
      this.setData({
        people: res.data.data,
        goods: active[options.index]
      })
    })
  },
  hidePopup: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showPopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  getPeople() {
    this.showPopup();
    request({
      url: '/api/v1/activity/searchActivityUser',
      method: "POST",
      data: {
        activityId: this.data.goods.activityId,
        isJackpot: 1
      }
    }).then(res => {
      this.setData({
        list: res.data.data,
      })
    })
  },
  req() {
    request({
      url: '/api/v2/app/token/addActivityUser',
      method: 'POST',
      data: {
        activityId: this.data.goods.activityId
      }
    }).then(res => {
      if (res.code == 200) {
        wx.navigateBack({
          delta: 1
        });
        wx.showToast({
          title: '申请成功',
          icon: 'success',
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {},
          fail: () => {},
          complete: () => {

          }
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000,
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {},
          fail: () => {},
          complete: () => {

          }
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //取消事件
  _error() {
    this.hidePopup();
  },
  //确认事件
  _success() {
    this.hidePopup();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})