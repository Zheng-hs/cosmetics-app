// pages/goods_list/index.js
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      },
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  totalPage: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/api/v2/app/notToken/searchAllActivity",
      method: 'POST',
      data: {
        activityType: 1
      }
    });
    const total = res.data.total;
    this.totalPage = Math.ceil(total / this.QueryParams.pagesize);
    wx.setStorageSync("try",res.data.data);
    this.setData({
      //拼接了数组
      goodsList: [...this.data.goodsList, ...res.data.data]
    })
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },
  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    //获取被点击的标题索引
    const {
      index
    } = e.detail;
    //修改原数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data中
    this.setData({
      tabs
    })
  },

  buy(e){
    wx.navigateTo({
      url: '/pages/active/index?index=' + e.currentTarget.dataset.index,
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
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPage) {
      //没有下一页数据
      wx.showToast({
        title: '没有下一页数据'
      });

    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})