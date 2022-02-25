import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
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
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];

    //  过滤购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({
      address
    });
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;

    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  // 点击支付
  async handleOrderPay(){
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 判断
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 创建订单
    const header = {
      Authorization:token
    };
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v=>goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    }
    // 发送请求
    const order_number = await request({
      url: "/my/orders/create",
      method: "POST",
      data: orderParams,
      header
    })
    // 发起预支付
    const {pay} = await request({
      url: "/my/orders/req_unifiedorder",
      method: "POST",
      data: {
        order_number
      },
        header
    })

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