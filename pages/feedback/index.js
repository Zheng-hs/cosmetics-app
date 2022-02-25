// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs:[],
    textVal:''
  },
  UpLoad:[],
   //标题点击事件 从子组件传递过来
   handleTabsItemChange(e) {
     //获取被点击的标题索引
     const {
       index
     } = e.detail;
     //修改原数组
     let {
       tabs
     } = this.data;
     tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
     //赋值到data中
     this.setData({
       tabs
     })
   },
   handleChooseImg(){
     wx.chooseImage({
      //  同时选中图片数量
       count: 9,
      //  图片格式 原图 压缩
       sizeType: ['original', 'compressed'],
      //  图片来源 相册 照相机
       sourceType: ['album', 'camera'],
       success: (result) => {
         this.setData({
           chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
         })
       },
       fail: () => {},
       complete: () => {}
     });
       
   },
   handleRemoveImg(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImgs}=  this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
   },
   handleTextInput(e){
     this.setData({
       textVal:e.detail.value
     })
   },
   handleFormSubmit(){
     const {textVal,chooseImgs} = this.data;
    //  合法验证
    if(!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
        
      return;
    }
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });

    if(chooseImgs.length!=0) {

      // 准备上传图片到专门的服务器
      // 不支持多个文件
      chooseImgs.forEach((v,i)=>{
  
        wx.uploadFile({
          // 上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的图片路径
          filePath: v,
          // 上传的图片名称 后台来获取文件 file
          name: 'file',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data.url);
            this.UpLoad.push(url);
  
            if(i===chooseImgs.length-1){
              wx.hideLoading();
              console.log(111);
            }
            this.setData({
              textVal:'',
              chooseImgs: []
            })
            wx.navigateBack({
              delta: 1
            });
              
          }
        });
      })
    } else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
        
      console.log('只是提交了文本');
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