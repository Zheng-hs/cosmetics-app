import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/zhongcao/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify: [],
    tabs: [],
    content: []
  },
  ab: [],
  getClassify() {
    request({
      url: "/api/v2/app/notToken/getArticlesClassify",
      method: "POST",
      data: {
        articlesClassifyType: 2
      }
    }).then(res => {
      const list = res.data.data
      const list1 = []
      let i = 0
      const a = list.forEach(v => {
        if (i == 0) {
          const x = true;
          list1.push({
            id: i,
            value: v.articlesClassifyName,
            isActive: x
          })
          i++;
        } else {
          const x = false;
          list1.push({
            id: i,
            value: v.articlesClassifyName,
            isActive: x
          })
          i++
        }

      })
      
      this.setData({
        classify: res.data.data,
        tabs: list1
      })
      wx.setStorageSync('classify', res.data.data);
        
      this.getText(res.data.data)
    })
    
  },
  getText(i) {
    request({
      url: '/api/v2/app/notToken/getArticles',
      method: 'POST',
      data: {
        articlesClassifyId: i[0].articlesClassifyId,
        articlesType: 2
      }
    }).then(res => {
      wx.setStorageSync("content", res.data.data);
      this.setData({
        content: res.data.data
      })
    })
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2 修改源数组
    let {
      tabs
    } = this.data;
    let {classify} = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    request({
      url: '/api/v2/app/notToken/getArticles',
      method: 'POST',
      data: {
        articlesClassifyId: classify[index].articlesClassifyId,
        articlesType: 2
      }
    }).then(res => {
      wx.setStorageSync("content", res.data.data);
      this.setData({
        content: res.data.data
      })
    })
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getClassify()    
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