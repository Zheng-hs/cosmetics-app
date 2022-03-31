import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: {},
    totalPrice: 0,
    totalNum: 0,
    oldTotalPrice: 0,
    coupon: [],
    showModalStatus: false,
    couponNum:0
  },
  couponList: [],
  cartList:'',
  index:0,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.index = options.index
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
    const cart = wx.getStorageSync("seckill");
    this.setData({
      address
    });
    this.cartList = cart[this.index].activityId
    var temp = cart[this.index]
    console.log(temp);
    // this.cartList.push();
    var totalPrice = cart[this.index].goodsPrice
    // 总价格 总数量
    this.setData({
      cart: temp,
      address,
      totalPrice
    });
  },
  goAddress(){
    wx.navigateTo({
      url: '/pages/address/index',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
    // 点击支付
  async handleOrderPay() {
    const address = wx.getStorageSync("address");
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址"
      });
      return;
    }
    // console.log(orderlist);
    request({
      url: "/api/v2/app/token/addActivityOrder",
      method: "POST",
      data: {
        activityId: this.cartList,
        userName: address.userName,
        limitQuantity: 1,
        userPhone: address.telNumber,
        userAddress: address.all
      }
    }).then(res => {
      if (res.code == 200) {
        wx.navigateBack({
          delta: 1
        });
        wx.showToast({
          title: '抢购成功',
          icon: 'success',
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {
          },
          fail: () => {},
          complete: () => {
            
          }
        });
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
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