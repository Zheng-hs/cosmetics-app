import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus: false,
    inputValue: ''
  },
  TimeId:-1,
  handleInput(e){
    // 获取输入框的值
    const {value} = e.detail;
    // 检测合法
    if(!value.trim()){
      this.setData({
        goods: [],
        isFocus: false
      })
      clearTimeout(this.TimeId);
      // 不合法
      return;
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=> {
      this.qsearch(value);
    },1000);

  },
  async qsearch(query){
    const res = await request({
      url: "/api/v2/app/notToken/searchGoods",
      method: 'POST',
      data: {
        goodsName: query
      }
    });
    this.setData({
      goods: res.data
    })
  },
  handleCancel(){
    this.setData({
      inputValue: '',
      isFocus: false,
      goods: []
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