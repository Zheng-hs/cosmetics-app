import {
  request
}
from '../../request/index'

// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseImgs: [],
    textVal: '',
    stars: [{
        flag: 1,
        bgImg: "icon-star-full",
        bgfImg: "icon-star"
      },
      {
        flag: 1,
        bgImg: "icon-star-full",
        bgfImg: "icon-star"
      },
      {
        flag: 1,
        bgImg: "icon-star-full",
        bgfImg: "icon-star"
      },
      {
        flag: 1,
        bgImg: "icon-star-full",
        bgfImg: "icon-star"
      },
      {
        flag: 1,
        bgImg: "icon-star-full",
        bgfImg: "icon-star"
      }
    ]
  },
  UpLoad: [],
  level: 0,
  type: '',
  uid:'',
  orderId:'',
  score: function (e) {
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 1
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 2
      })
    }
    const a = that.data.stars.filter(v => v.flag == 2);
    this.level = a.length
  },
  handleChooseImg() {
    wx.chooseImage({
      //  同时选中图片数量
      count: 9,
      //  图片格式 原图 压缩
      sizeType: ['original', 'compressed'],
      //  图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
      fail: () => {},
      complete: () => {}
    });

  },
  handleRemoveImg(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let {
      chooseImgs
    } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  handleFormSubmit() {
    const {
      textVal,
      chooseImgs
    } = this.data;
    //  合法验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none',
        mask: true
      });

      return;
    }
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });

    if (chooseImgs.length != 0) {

      // 准备上传图片到专门的服务器
      // 不支持多个文件
      chooseImgs.forEach((v, i) => {

        wx.uploadFile({
          // 上传到哪里
          url: 'http://1.15.186.9:8006/api/v1/upload',
          // 被上传的图片路径
          filePath: v,
          // 上传的图片名称 后台来获取文件 file
          name: 'file',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            let url = JSON.parse(result.data).path;
            this.UpLoad.push(url);
            console.log(this.UpLoad);
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
            }
            this.setData({
              textVal: '',
              chooseImgs: []
            })
          }
        });
      })
    } else {
      request({
        url: '/api/v1/comment/add',
        method: 'POST',
        data: {
          commentContent: textVal,
          commentType: this.type,
          goodsLevel: this.level,
          uid: this.uid,
          imgPath: wx.getStorageSync("userinfo").avatarUrl,
          commentUser: wx.getStorageSync("userinfo").nickName,
          orderId: this.orderId
        }
      }).then(res=> {
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          // 防止用户手抖 疯狂点击按钮
          mask: true,
          success: (result) => {},
          fail: () => {},
          complete: () => {

          }
        });
      })
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
    wx.navigateBack({
      delta: 1
    });


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.type = options.type
    this.uid = options.uid
    this.orderId = options.id
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