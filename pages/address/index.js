import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
import {
  request
} from "../../request/index.js"
// pages/cart/index.js
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/address/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    currentIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url: '/api/v1/address/search'
    }).then(res=>{
      this.setData({
        address: res.data
      })
      wx.setStorageSync("ads", res.data);
    })
  },
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/index',
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });

  },
  chooseAddress(e) {
    const i = e.currentTarget.dataset.index
    const ad = wx.getStorageSync('ads');
    const address = {
      all: ad[i].province+ad[i].city+ad[i].area+ad[i].address,
      userName: ad[i].userName,
      telNumber: ad[i].phone
    }
    wx.setStorageSync("address", address);
    this.setData({
      currentIndex: i
    })
    wx.navigateBack({
      delta: 1
    });
      
  },
  getDetail(e) {
    const index = e.currentTarget.dataset.index
     wx.navigateTo({
       url: '/pages/add/index'+'?i='+index,
       success: (result) => {

       },
       fail: () => {},
       complete: () => {}
     });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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