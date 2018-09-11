// pages/my/my.js
import util from '../../utils/request.js';
import constant from '../../utils/constant.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    renzed:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.renzheng()
  },



  renzheng: function () {
    let that = this
    var customerId = wx.getStorageSync(constant.customerId)
    let params = {
      customerId: customerId
    }
    util.getRequest(['authentication/getAuthentication', params]).then(function (res) {
      console.log(res)
      if (res.status == 'fail') {
        that.setData({
          renzed : res.status
        })
      }else if (res.authentication.authResult == '等待认证'){
        that.setData({
          renzed: res.authentication.authResult
        })
      } else if (res.authentication.authResult == '认证不通过'){
        that.setData({
          renzed: res.authentication.authResult
        })
      }else{
        that.setData({
          renzed: res.authentication.authResult
        })
      }
    }).catch(function (err) {
      console.log(err)
      wx.showToast({
        title: '加载失败...',
      }, wx.navigateBack({
        delta: 1
      })
      )
    })
  },



// 认证
  Authentication:function(){
    wx.navigateTo({
      url: '../../pages/Authentication/Authentication',
    })
  },

// 发布
  Release:function(){
    wx.navigateTo({
      url: '../../pages/myReleased/myReleased',
    })
  },

// 我的评论
  Comment:function(){
    wx.navigateTo({
      url: '../../pages/myReply/myReply',
    })
  },
// 评论我的
  CommentMe:function(){
    wx.navigateTo({
      url: '../../pages/replyMe/replyMe',
    })
  },

// 浏览记录
  Records:function(){
    wx.navigateTo({
      url: '../../pages/browse/browse',
    })
  },

// 收藏
  Collection:function(){
    wx.navigateTo({
      url: '../../pages/myCollection/myCollection',
    })
  },
// 志愿者
  volunteer:function(){
    wx.navigateTo({
      url: '../../pages/volunteer/volunteer',
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