//Page Object
import {
  request
} from "../../request/index.js"
Page({
  data: {
    swiperList: [],
    catesList: [],
    floorList: []
  },
  //options(Object)
  //页面开始加载的时候就会触发
  onLoad: function (options) {
    //1.发送异步请求 优化的手段可以通过es6的promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
   this.getSwiperList();
   this.getCateList();
   this.getFloorList();
  },
  getSwiperList() {
     request({
       url: "/api/v2/app/notToken/searchHomePageImg",
       method: 'POST'
     }).then(result => {
       this.setData({
         swiperList: result.data.data
       })
     })
       
  },
  getCateList() {
     request({
       url: "/api/v2/app/notToken/searchHotGoods?pageNo=1&pageSize=6",
       method: 'POST'
     }).then(result => {
      //  console.log(result);
       this.setData({
         catesList: result.data.data
       })
     })

  },
  getFloorList() {
     request({
       url: "/api/v2/app/notToken/getArticles",
       method: 'POST',
       data: {
         articlesId: 1}
     }).then(result => {
       this.setData({
         floorList: result.data.data
       })
     })
       
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});