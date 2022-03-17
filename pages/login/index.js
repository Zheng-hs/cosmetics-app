// pages/login/index.js
import {
  login
} from '../../utils/asyncWx.js'
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleGetUserInfo(e) {
    // console.log(e);
    const {
      userInfo
    } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  },
  getUserProfile(e) {
    // console.log(e);
    wx.getUserProfile({
      desc: '授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: async (res) => {
        console.log(res);
        wx.setStorageSync("userinfo", res.userInfo);
        try {
          const {
            code
          } = await login();
          // console.log(code);
          // 发送请求 获取token

          const {
            token
          } = request({
            url: "/app/login",
            data: {
              code: code,
              nickeName: res.userInfo.nickName,
              imgPath: res.userInfo.avatarUrl
            },
            method: "post"
          }).then(res=>{
            wx.setStorageSync("token", res.data.token);
          })
          // 把token存到缓存
          
          wx.navigateBack({
            delta: 1
          });
        } catch (error) {
          console.log(error);
        }
      }
    })
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