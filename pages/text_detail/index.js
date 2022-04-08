import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/text_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},
    isCollect: false,
    textVal: '',
    showModalStatus: false,
    showModalStatus1: false,
    showModalStatus2: false,
    articlesContent: ''
  },
  commentId: "",
  replyId: "",
  articlesId: '',
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
  powerDrawer1: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util1(currentStatu)
    this.commentId = e.currentTarget.dataset.id

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
  powerDrawer2: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util2(currentStatu)
    this.replyId = e.currentTarget.dataset.id

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
          showModalStatus2: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus2: true
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const a = wx.getStorageSync("content");
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collects") || [];
    // 2 判断当前商品是否被收藏

    if (!options.i) {
      this.articlesId = collect[options.index].articlesId
      request({
        url: '/api/v2/app/notToken/getArticles',
        method: 'POST',
        data: {
          articlesId: collect[options.index].articlesId,
        }
      }).then(res => {

      })
      let isCollect = collect.some(v => v.articlesId === collect[options.index].articlesId);
      var result = collect[options.index].articlesContent;
      let html = result
        .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;">')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 style="width: 100%; border-radius: 8Px;"');

      this.setData({
        content: collect[options.index],
        articlesContent: html,
        isCollect
      })
      request({
        url: "/api/v1/comment/search",
        method: 'POST',
        data: {
          articlesId: collect[options.index].articlesId,
          commentType: 1
        }
      }).then(res => {
        //  console.log(res);
        this.setData({
          evaluationList: res.data.data
        })
      });
    } else {
      this.articlesId = a[options.i].articlesId
      request({
        url: '/api/v2/app/notToken/getArticles',
        method: 'POST',
        data: {
          articlesId: a[options.i].articlesId,
        }
      }).then(res => {

      })
      let isCollect = collect.some(v => v.articlesId === a[options.i].articlesId);
      var result = a[options.i].articlesContent;
      let html = result
        .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;">')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 style="width: 100%; border-radius: 8Px;"');
      this.setData({
        content: a[options.i],
        articlesContent: html,
        isCollect
      })
      request({
        url: "/api/v1/comment/search",
        method: 'POST',
        data: {
          uid: a[options.i].articlesId,
          commentType: 1
        }
      }).then(res => {
        //  console.log(res);
        this.setData({
          evaluationList: res.data.data
        })
      });
    }
  },
  dianzan() {
    request({
      url: '/api/v1/articles/addArticlesLike',
      method: 'POST',
      data: {
        articlesId: this.articlesId
      }
    }).then(res => {
      if (res.code == 200) {
        request({
          url: '/api/v2/app/notToken/getArticles',
          method: 'POST',
          data: {
            articlesId: this.articlesId
          }
        }).then(res => {
          this.setData({
            content: res.data.data[0]
          })
        })
      }
    })
  },
  scroll() {
    console.log(111);
    wx.pageScrollTo({
      selector: '.goods_buy',
      duration: 100
    })
  },
  replay() {
    if (this.data.textVal === '') {
      wx.showToast({
        title: '请输入评论',
        icon: 'none',
        // 防止用户手抖 疯狂点击按钮
        mask: true,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    } else {
      request({
        url: '/api/v1/reply/add',
        method: "POST",
        data: {
          commentId: this.commentId,
          replyContent: this.data.textVal,
          commentUser: wx.getStorageSync('userinfo').nickName
        }
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            showModalStatus1: false,
            textVal: ''
          });
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            // 防止用户手抖 疯狂点击按钮
            mask: true,
            success: (result) => {
              request({
                url: "/api/v1/comment/search",
                method: 'POST',
                data: {
                  uid: this.data.content.articlesId,
                  commentType: 1
                }
              }).then(res => {
                // console.log(res);
                this.setData({
                  evaluationList: res.data.data
                })
              });
            },
            fail: () => {},
            complete: () => {}
          });
        }
      })
    }
  },
  replay1() {
    if (this.data.textVal === '') {
      wx.showToast({
        title: '请输入评论',
        icon: 'none',
        // 防止用户手抖 疯狂点击按钮
        mask: true,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    } else {
      request({
        url: '/api/v1/reply/add',
        method: "POST",
        data: {
          commentId: this.replyId,
          replyContent: this.data.textVal,
          commentUser: wx.getStorageSync('userinfo').nickName

        }
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            showModalStatus2: false,
            textVal: ''
          });
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            // 防止用户手抖 疯狂点击按钮
            mask: true,
            success: (result) => {
              request({
                url: "/api/v1/comment/search",
                method: 'POST',
                data: {
                  uid: this.data.content.articlesId,
                  commentType: 1
                }
              }).then(res => {
                // console.log(res);
                this.setData({
                  evaluationList: res.data.data
                })
              });
            },
            fail: () => {},
            complete: () => {}
          });
        }
      })
    }
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  addCart() {
    if (this.data.textVal === '') {
      wx.showToast({
        title: '请输入评论',
        icon: 'none',
        // 防止用户手抖 疯狂点击按钮
        mask: true,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    } else {

      request({
        url: '/api/v1/comment/add',
        method: 'POST',
        data: {
          commentContent: this.data.textVal,
          uid: this.data.content.articlesId,
          commentType: 1
        }
      }).then(res => {
        if (res.code == 200) {
          this.setData({
            showModalStatus: false,
            textVal: ''

          });
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            // 防止用户手抖 疯狂点击按钮
            mask: true,
            success: (result) => {
              request({
                url: "/api/v1/comment/search",
                method: 'POST',
                data: {
                  uid: this.data.content.articlesId,
                  commentType: 1
                }
              }).then(res => {
                // console.log(res);
                this.setData({
                  evaluationList: res.data.data
                })
              });
            },
            fail: () => {},
            complete: () => {}
          });
        }
      })
    }
  },
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collects") || [];
    // 判断是否收藏
    let index = collect.findIndex(v => v.articlesId === this.data.content.articlesId);
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
      collect.push(this.data.content);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collects", collect);
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