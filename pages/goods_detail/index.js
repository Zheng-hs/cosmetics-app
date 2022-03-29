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
    goodsObj: {},
    isCollect: false,
    coupon: '',
    evaluationList: [],
    like: [],
    goodsNorms: [],
    showModalStatus: false,
    showModalStatus1: false,
    showCoupon: false,
    currentIndex: 0,
    goodsnum: 1,
    normvalue: '',
    isReceive: true
  },
  GoodsInfo: {},
  num: 1,
  list: [],
  i: 0,
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
  powerDrawer2: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util2(currentStatu)
  },
  util2: function (currentStatu) {
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
          showModalStatus1: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus1: true
      });
    }
  },
  powerDrawer1: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util1(currentStatu)
  },
  util1: function (currentStatu) {
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
      animationData1: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData1: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showCoupon: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showCoupon: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url: "/api/v2/app/notToken/getComment",
      method: 'POST',
      data: {
        uid: options.goodsId
      }
    }).then(res => {
      console.log(res);
      this.setData({
        evaluationList: res.data.data
      })
    });

    request({
      url: "/api/v2/app/notToken/searchCoupon",
      method: 'POST',
      data: {
        goodsId: options.goodsId
      }
    }).then(res => {
      // console.log(res);
      this.setData({

        coupon: res.data
      })
    })

    request({
      url: '/api/v2/app/notToken/getGoodsNorms' + '?' + 'goodsId=' + options.goodsId,
      method: 'POST',

    }).then(res => {
      this.list = res.data[0].goodsNormsEntityList
      this.setData({

        goodsNorms: res.data[0].goodsNormsEntityList
      })
    })

    request({
      url: "/api/v2/app/notToken/getUserLike"
    }).then(res => {
      this.setData({
        like: res.data
      })
    })
  },
  buy() {
    let cart = []
    let temp = {
        goodsId: this.GoodsInfo.goodsId,
        goodsName: this.GoodsInfo.goodsName,
        goodsNormsValue: this.list[this.i].normsValue,
        goodsAmount: parseInt(this.num),
        goodsOldPrice: this.GoodsInfo.goodsOldPrice,
        goodsNewPrice: this.GoodsInfo.goodsNewPrice,
        imgPath: this.GoodsInfo.mainImage,
        checked: true,
        cartId:0
    }
    cart.push(temp)
    wx.setStorageSync("cart", cart);
     wx.navigateTo({
       url: '/pages/pay/index'
     })
  },
  getCoupon(e){
     if (!wx.getStorageSync("token")) {
       wx.showModal({
         title: '提示',
         content: '请先登录',
         success(res) {
           if (res.confirm) {
             wx.navigateTo({
               url: '/pages/login/index'
             })
           } else if (res.cancel) {

           }
         }
       })
     } else {
    request({
      url: "/api/v2/app/token/receiveCoupon",
      method: 'POST',
      data: {
        couponId: e.currentTarget.dataset.id
      }
    }).then(res => {
      if(res.code==200) {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {
            this.setData({
              isReceive: false,
              showCoupon: false
            })
          },
          fail: () => {},
          complete: () => {}
        });
      } else {
        wx.showToast({
          title: '不能重复领取',
          icon: 'error',
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        });
      }
    })
    
    }
  },
  addCart() {
    if (!wx.getStorageSync("token")) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success(res) {
          if (res.confirm) {
             wx.navigateTo({
               url: '/pages/login/index'
             })
          } else if (res.cancel) {
             
          }
        }
      })
    } else {
      if (this.list[this.i].goodsStock <= 0) {
        wx.showToast({
          title: '商品库存不足',
          icon: 'error',
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        });
      } else {
        request({
          url: "/api/v1/cart/add",
          method: 'POST',
          data: {
            goodsId: this.GoodsInfo.goodsId,
            goodsName: this.GoodsInfo.goodsName,
            goodsNormsValue: this.list[this.i].normsValue,
            goodsAmount: parseInt(this.num),
            goodsOldPrice: this.GoodsInfo.goodsOldPrice,
            goodsNewPrice: this.GoodsInfo.goodsNewPrice
          }
        }).then(res => {
          //弹窗提示
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            // 防止用户手抖 疯狂点击按钮
            mask: true,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
          });
          this.setData({
            showModalStatus: false
          });
        })
      }
    }
  },
  handleItemNumAdd() {
    if (this.num >= 1) {
      this.num++
    }
    this.setData({
      goodsnum: this.num
    })
  },
  handleItemNumEdit() {
    if (this.num > 1) {
      this.num--;
    }
    this.setData({
      goodsnum: this.num
    })
  },
  async handleItemTap(e) {
    // 1 获取被点击的标题身上的索引
    // 2 给data中的currentIndex赋值就可以
    const {
      index,
      id
    } = e.currentTarget.dataset;
    this.i = index
    // 重新设置 右侧内容的sroll-view标签距离顶部的距离
    this.setData({
      currentIndex: index,
      normvalue: this.list[this.i].normsValue
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
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goodsId === this.GoodsInfo.goodsId);
    this.setData({
      goodsObj: this.GoodsInfo,
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.subImageList.map(v => v)
    // 接收传递过来的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });

  },

  // 点击商品收藏
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断是否收藏
    let index = collect.findIndex(v => v.goodsId === this.GoodsInfo.goodsId);
    // 当index!=-1表示已被收藏过
    if (index !== -1) {
      // 已经收藏 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    } else {
      // 没收藏
      collect.push(this.GoodsInfo);
      isCollect = true;
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
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
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