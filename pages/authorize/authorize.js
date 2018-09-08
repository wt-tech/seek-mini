// pages/authorize/authorize.js
import util from '../../utils/request.js'
import constant from '../../utils/constant.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   var that = this
    //   //调用应用实例的方法获取全局数据
    //   app.getUserInfo(function (userInfo) {
    //     //更新数据
    //     that.setData({
    //       userInfo: userInfo,
    //       loadingHidden: true
    //     })
    //   });

    //   this.loadOrderStatus();
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
    this.loadOrderStatus();
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

  },

  /**
   * 授权登录
   */
  onGetUserInfo: function (e) {
    var that = this
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:fail auth deny"){
      wx.switchTab({
        url: '/tabs/index/index'
      })
    } else {
      let userInfo = e.detail.userInfo
      wx.setStorageSync('userInfo', userInfo)
      app.saveCustomerId2Local(userInfo);
      console.log(userInfo)
      wx.navigateBack({
        delta: 1
      });


    }
  },


  saveuserInfo: function (params) {
    util.putRequest(['customer', params]).then(function (res) {
      console.log(res)
    }).catch(function (err) {
      console.log(err)
    })
  },


  loadOrderStatus: function () {

  },
})