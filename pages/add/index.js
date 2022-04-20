// pages/add/index.js
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
    region: [],
    inputValue: '',
    inputValue1: '',
    inputValue2: '',
  },
  address: '',
  userName: '',
  phone: '',
  adlist: [],
  exitList: [],
  id: '',
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
      request({
        url: "/api/v1/address/add",
        method: "POST",
        data: {
          userName: address.userName,
          phone: address.telNumber,
          address: address.detailInfo,
          province: address.provinceName,
          city: address.cityName,
          area: address.countyName
        }
      }).then(res => {
        wx.setStorageSync("address", address);
      })
      wx.navigateTo({
        url: '/pages/address/index',
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });


    } catch (error) {
      console.log(error);
    }

  },
  bindRegionChange: function (e) {
    this.adlist = e.detail.value
    this.setData({
      region: e.detail.value
    })
  },
  bindKeyInput: function (e) {
    this.userName = e.detail.value
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindKeyInput1: function (e) {
    this.phone = e.detail.value
    this.setData({
      inputValue1: e.detail.value
    })
  },
  bindKeyInput2: function (e) {
    this.address = e.detail.value
    this.setData({
      inputValue2: e.detail.value
    })
  },
  add() {
    request({
      url: "/api/v1/address/add",
      method: "POST",
      data: {
        userName: this.userName,
        phone: this.phone,
        address: this.address,
        province: this.adlist[0],
        city: this.adlist[1],
        area: this.adlist[2]
      }
    }).then(res => {
      const address = {
        all: this.adlist[0] + this.adlist[1] + this.adlist[2] + this.address,
        cityName: this.adlist[1],
        countyName: this.adlist[2],
        detailInfo: this.address,
        provinceName: this.adlist[0],
        telNumber: this.phone,
        userName: this.userName
      }
      wx.setStorageSync("address", address);
      wx.navigateBack({
        delta: 1
      });
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        // 防止用户手抖 疯狂点击按钮
        mask: true,
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      });
    })
  },
  exitadd() {
    request({
      url: "/api/v1/address/update",
      method: "POST",
      data: {
        addressId: this.exitList.addressId,
        userName: this.userName,
        phone: this.phone,
        address: this.address,
        province: this.adlist[0],
        city: this.adlist[1],
        area: this.adlist[2]
      }
    }).then(res => {
      const address = {
        all: this.adlist[0] + this.adlist[1] + this.adlist[2] + this.address,
        cityName: this.adlist[1],
        countyName: this.adlist[2],
        detailInfo: this.address,
        provinceName: this.adlist[0],
        telNumber: this.phone,
        userName: this.userName
      }
      wx.setStorageSync("address", address);
      wx.navigateBack({
        delta: 1
      });

      wx.showToast({
        title: '修改成功',
        icon: 'success',
        // 防止用户手抖 疯狂点击按钮
        mask: true,
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      });
    })
  },
  delete() {
    const b = []
    b.push(this.exitList.addressId)
    wx.showModal({
      title: '提示',
      content: '是否删除地址',
      success(res) {
        if (res.confirm) {
          request({
            url: "/api/v1/address/delete",
            method: "DELETE",
            data: b
          }).then(res => {
            wx.navigateBack({
              delta: 1
            });
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


          })
        } else if (res.cancel) {

        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.i) {
      const ads = wx.getStorageSync("ads");
      const a = [];
      a.push(ads[options.i].province);
      a.push(ads[options.i].city);
      a.push(ads[options.i].area);
      this.exitList = ads[options.i]
      this.userName = ads[options.i].userName
      this.phone = ads[options.i].phone
      this.address = ads[options.i].address
      this.adlist = a
      this.setData({
        add: ads[options.i],
        inputValue: ads[options.i].userName,
        inputValue1: ads[options.i].phone,
        inputValue2: ads[options.i].address,
        region: a
      })
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