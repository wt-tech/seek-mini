// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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