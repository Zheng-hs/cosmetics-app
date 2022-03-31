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
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    oldTotalPrice: 0,
    coupon: [],
    showModalStatus: false,
    couponNum:0
  },
  couponList: [],
  cartList:[],
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
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
    this.cartList = cart;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    let oldTotalPrice = 0;
    let list = [];
    cart.forEach(v => {
      totalPrice += v.goodsAmount * v.goodsNewPrice;
      totalNum += v.goodsAmount;
      oldTotalPrice += v.goodsAmount * v.goodsOldPrice
      list.push(v.goodsId)
    })
    if(cart.length>1) {
      request({
        url: "/api/v1/coupon/searchCouponByList",
        method: 'POST',
        data:  list
      }).then(res => {
        const coupon = res.data.filter(v => v.useLimitValue < totalPrice)
        // console.log(coupon);
        this.setData({
          coupon: coupon
        })
      })
    } else {

      request({
        url: "/api/v2/app/token/searchCouponUser",
        method: 'POST',
        data: {
          goodsId: list[0]
        }
      }).then(res => {
        const coupon = res.data.data.filter(v => v.useLimitValue < totalPrice)
        this.setData({
          coupon: coupon
        })
      })
    }
    this.setData({
      cart,
      totalPrice,
      totalNum,
      oldTotalPrice,
      address, 
      allNum: oldTotalPrice - totalPrice
    });
  },
  bandleChange(e) {
    // 1 获取单选框中的值
    let couponId = e.detail.value;
    request({
      url: "/api/v1/coupon/search",
      method: "POST",
      data:{
        couponId: couponId
      }
    }).then(res=>{
      this.couponList = res.data.data
      this.setData({
        // gender:gender
        couponValue: res.data.data[0],
        couponNum: res.data.data[0].couponValue
      })
    })
    
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
    let orderlist = [];
    let temp = {};
    const address = wx.getStorageSync("address");
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址"
      });
      return;
    }
    if (this.couponList.length == 0) {
      this.cartList.forEach(v => {
        temp = {
          cartId: v.cartId,
          goodsId: v.goodsId,
          goodsCnt: v.goodsAmount,
          goodsName: v.goodsName,
          goodsNormsValue: v.goodsNormsValue,
          goodsOriginalPrice: v.goodsNewPrice * v.goodsAmount,
          goodsPrice: v.goodsNewPrice,
          goodsPayPrice: v.goodsNewPrice * v.goodsAmount,
          couponId: 0,
          userId: address.userName,
          userPhone: address.telNumber,
          userAddress: address.all
        }
        orderlist.push(temp)
      })
    } else {
      this.cartList.forEach(v=> {
        temp = {
          cartId: v.cartId,
          goodsId: v.goodsId,
          goodsCnt: v.goodsAmount,
          goodsName: v.goodsName,
          goodsNormsValue: v.goodsNormsValue,
          goodsOriginalPrice: v.goodsNewPrice * v.goodsAmount,
          goodsPrice: v.goodsNewPrice,
          goodsPayPrice: v.goodsNewPrice * v.goodsAmount - this.couponList[0].couponValue / this.cartList.length,
          couponId: this.couponList[0].couponId,
          userId: address.userName,
          userPhone: address.telNumber,
          userAddress: address.all
        }
        orderlist.push(temp)
      })
    }
    // console.log(orderlist);
    request({
      url: "/api/v1/order/add",
      method: "POST",
      data: orderlist
    }).then(res => {
       if (res.code == 200) {
         wx.navigateBack({
           delta: 1
         });
         wx.showToast({
           title: '下单成功',
           icon: 'success',
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