// pages/add_text/index.js
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleContent: '', //文章正文
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 10,
    isIOS: false,
    textVal: '',
    currentIndex1: 0,
    classify:[],
    src: ''
  },
  articlesClassifyId: '',
  // -----------富文本编辑器 start ------------------
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      //一进入页面就初始化富文本编辑器，此时还未发送请求获取不到数据，编辑器内容html为空（that.data.articleContent为空）
      //请求完数据后再调用这个方法，才能取到数据写入编辑器')
      that.editorCtx.setContents({
        html: that.data.articleContent //将数据写入编辑器内
      })

      //在这里用event.on注册onEditorReady方法
      //当event.emit执行时，就会调用onEditorReady方法，重新渲染富文本编辑器
      //此时就能获取到数据，写入编辑器中（即给that.data.articleContent赋值后，他不再为空）
      wx.$on('resetEditor', () => {

      })

    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  handleChooseImg() {
     const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          // 上传到哪里
          url: 'http://1.15.186.9:8006/api/v1/upload',
          // 被上传的图片路径
          filePath: res.tempFilePaths[0],
          // 上传的图片名称 后台来获取文件 file
          name: 'file',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            that.setData({
              src: JSON.parse(result.data).path
            })
          }

        })
      }
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        wx.uploadFile({
          // 上传到哪里
          url: 'http://1.15.186.9:8006/api/v1/upload',
          // 被上传的图片路径
          filePath: res.tempFilePaths[0],
          // 上传的图片名称 后台来获取文件 file
          name: 'file',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            that.editorCtx.insertImage({
              src: JSON.parse(result.data).path,
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '80%',
              success: function () {
                console.log('insert image success')
              }
            })
          }
        });

      }
    })
  },
  getEditorValue(e) {
    this.setData({
      articleContent: e.detail.html
    })
    console.log(e.detail.html)
  },
  sumbit() {
    const that = this
    request({
      url: '/api/v1/articles/add',
      method: 'POST',
      data: {
        articlesAuthor: wx.getStorageSync('userinfo').nickName,
        articlesClassifyId: this.articlesClassifyId,
        articlesContent: that.data.articleContent,
        articlesDescribe: '',
        articlesImg: that.data.src,
        articlesTitle: that.data.textVal,
        articlesType: 2
      }
    }).then(res=> {
      if(res.code==200) {
        wx.navigateBack({
          delta: 1
        });
          
         wx.showToast({
           title: '发布成功',
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
  async chooseTag(e) {
    const {
      index1,
      id1
    } = e.currentTarget.dataset;
    this.articlesClassifyId = id1
     this.setData({
       currentIndex1: index1
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const classify = wx.getStorageSync('classify');
    this.articlesClassifyId = classify[0].articlesClassifyId
    this.setData({
      classify
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