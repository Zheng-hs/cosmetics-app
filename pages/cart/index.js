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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    isDelete: true
  },
  cartList:[],
  deleteList:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async handleChooseAddress() {
    // wx.getSetting({
    //   success: (result) => {
    // 获取权限状态 主要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"]
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success: (res) => {
    //           console.log(res);
    //         }
    //       });

    //     } else {
    //用户 以前拒绝过授权权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    // 可以调用 获取收货地址
    //           wx.chooseAddress({
    //             success: (res1) => {
    //               console.log(res1);
    //             }
    //           });
    //         }
    //       });

    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
    // 获取权限状态
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      //  调用获取收货地址打api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }

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
    request({
      url: '/api/v1/cart/search'
    }).then(res => {
     const list = res.data.map((item) => {
        return Object.assign({}, item, {
          checked: false
        });
      });
      this.setData({
        cart: list
      }); 
      this.setCart(list) 
    })
    // 计算全选
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({
      address
    });
  },
  // 商品的选中
  handelItemChange(e) {
     // 1 获取被修改的商品的id
     const cartId = e.currentTarget.dataset.id;
     // 2 获取购物车数组 
     let {
       cart
     } = this.data;
     // 3 找到被修改的商品对象
     let index = cart.findIndex(v => v.cartId === cartId);
     // 4 选中状态取反
     cart[index].checked = !cart[index].checked;

     this.setCart(cart);
  },

  handleRemove(){
    this.cartList.forEach(v => {
      if (v.checked) {
        this.deleteList.push(v.cartId);
      } 
    })
    request({
      url: "/api/v1/cart/delete",
      method: 'DELETE',
      data: this.deleteList
    }).then(res => {
       request({
         url: '/api/v1/cart/search'
       }).then(res => {
         this.deleteList = [];
         const list = res.data.map((item) => {
           return Object.assign({}, item, {
             checked: false
           });
         });
         this.setData({
           cart: list
         });
         this.setCart(list)
       })
       wx.showToast({
         title: '删除成功',
         icon: 'success',
         // 防止用户手抖 疯狂点击按钮
         mask: true,
         success: (result) => {

         },
         fail: () => {},
         complete: () => {}
       });
    });
  },

  control() {
    this.setData({
      isDelete: false
    })
  },

  controlsuccess() {
    this.setData({
      isDelete: true
    })
  },

  // 设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goodsAmount * v.goodsNewPrice;
        totalNum += v.goodsAmount;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    this.cartList = cart;
  },
  // 商品全选功能
  handleItemAllCheck(){
    // 获取data中的数据
    let {cart,allChecked} = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 修改后的值 填充回data或缓存
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e){      
    // 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goodsId===id);
    // 判断是否要删除
    if (cart[index].goodsAmount === 1 && operation === -1) {
      // 弹窗提示
      return;
    } else {
      // 进行修改数量
      cart[index].goodsAmount += operation;
      // 设置回缓存和data
      this.setCart(cart);
    }
  },
  // 点击结算
  async handlePay(){
    // 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 判断用户有没有选购商品
    if(totalNum===0){
       await showToast({
         title: "您还没有选购商品"
       });
       return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
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