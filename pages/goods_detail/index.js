// pages/goods_detail/index.js
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false,
    coupon: '',
    evaluationList: []
  },
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const evaluationList = request({
      url: "/api/v1/comment/search",
      method: 'POST',
      data: {
        goodsId: options.goodsId
      }
    }).then(res => {
      // console.log(res);
      this.setData({
        evaluationList: res.data.data
      })
    });

    const coupon = request({
      url: "/api/v2/app/notToken/searchCoupon",
        method: 'POST',
        data: {
          goodsId: options.goodsId
        }
    }).then(res=>{
      // console.log(res);
      this.setData({
        
        coupon: res.data.data
      })
    })
  },


  async getGoodsDetail(goodsId) {
    const goodsObj = await request({
      url: "/api/v2/app/notToken/searchGoods",
      method: 'POST',
      data: {
        goodsId: goodsId
      }
    });
    this.GoodsInfo = goodsObj.data[0]
    this.setData({
      goodsObj: this.GoodsInfo
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.subImageList.map(v => v)
    // 接收传递过来的url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },

  handleCartAdd(){
    // 获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart")||[];
    // 判断商品对象是否存在购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    } else {
      // 存在 num++
      cart[index].num++;
      // console.log(cart[index].num);
    }
    // 把购物车加回到缓存中
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户手抖 疯狂点击按钮
      mask: true,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
       
  },
  // 点击商品收藏
  handleCollect(){
    let isCollect=false;
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 判断是否收藏
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 当index!=-1表示已被收藏过
    if(index!==-1) {
      // 已经收藏 在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
        
    } else {
      // 没收藏
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    // 修改data中的属性 isCollect
    this.setData({
      isCollect
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
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options
    const {
      goodsId
    } = options;
    this.getGoodsDetail(goodsId);
    
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