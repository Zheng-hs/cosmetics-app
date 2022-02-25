// pages/category/index.js
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    goodsList: [],
    // 被点击的左侧的菜单索引
    currentIndex: 0,
    currentIndex1: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  Cates: [],
  parentId: '',
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    web本地储存和小程序中的本地储存的区别
    1 写代码的方式不一样
    web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key","value") wx.getStorageSync("key")
    2 存的时候 有没有做类型转换
    web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
    小程序： 不存在类型转换这个操作 存什么类型的数据进去， 获取的时候就是什么类型
    */
    /*
    1 先判断一下本地储存中有没有旧的数据
    2 没有旧的数据 直接发送新请求
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地储存中的旧数据即可
    */
    // this.getCates();
    // 1 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据 定义过期时间 10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        //可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates
        let rightContent = this.Cates[0].goodsClassifyEntities;
        rightContent.unshift({
          classifyName: "全部",
          classifyId: 0
        });
        if (rightContent[1].classifyName === '全部') {
          rightContent.splice(rightContent[1], 1)
        }
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },

  async getCates() {
    const res = await request({
      url: "/api/v2/app/notToken/searchGoodsClassify",
      method: 'POST'
    });
    this.Cates = res.data;
    // 把接口的数据存储到本地储存中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    })
    let leftMenuList = this.Cates
    let rightContent = this.Cates[0].goodsClassifyEntities
    this.parentId = this.Cates[0].classifyId
    rightContent.unshift({
          classifyName: "全部",
          classifyId: 0
        }
        )
      if (rightContent[1].classifyName === '全部') {
        rightContent.splice(rightContent[1], 1)
      }
    // console.log(rightContent);
     const res1 = await request({
       url: "/api/v2/app/notToken/searchGoods",
       method: 'POST',
       data: {
         classifyParentId: this.Cates[0].classifyId
       }
     });
     let goodsList = res1.data
    this.setData({
      leftMenuList,
      rightContent,
      goodsList
    })
  },
  //左侧菜单的点击事件
  async handleItemTap(e) {
    // 1 获取被点击的标题身上的索引
    // 2 给data中的currentIndex赋值就可以
    const {
      index,
      id
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].goodsClassifyEntities;
    rightContent.unshift({
      classifyName: "全部",
      classifyId: 0
    });
    if (rightContent[1].classifyName === '全部') {
      rightContent.splice(rightContent[1], 1)
    }
    this.parentId = this.Cates[index].classifyId
     const res = await request({
       url: "/api/v2/app/notToken/searchGoods",
       method: 'POST',
       data: {
         classifyParentId: id
         }
     });
      let goodsList = res.data
       
    // 重新设置 右侧内容的sroll-view标签距离顶部的距离
    this.setData({
      currentIndex: index,
      rightContent,
      goodsList,
      scrollTop: 0
    })

  },
  async chooseTag(e) {
    const {
      index1,
      id1
    } = e.currentTarget.dataset;
    console.log(e);
    if(id1 === 0) {
      const res = await request({
        url: "/api/v2/app/notToken/searchGoods",
        method: 'POST',
        data: {
          classifyParentId: this.parentId
        }
      });
      let goodsList = res.data
      this.setData({
        currentIndex1: index1,
        goodsList
      })
    } else {

      const res = await request({
        url: "/api/v2/app/notToken/searchGoods",
        method: 'POST',
        data: {
          classifyId: id1
        }
      });
      let goodsList = res.data
      this.setData({
        currentIndex1: index1,
        goodsList
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