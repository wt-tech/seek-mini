// pages/myReply/myReply.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPageNo:1,
    allComents:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myReply()
  },

myReply: function (currentPageNo){
  let that = this
  var customerId = wx.getStorageSync(constant.customerId)
  let pages = currentPageNo || 1
  let params = {
    customerId: customerId,
    currentPageNo: pages
  }
  request.getRequest(['topcoment/listtopcomentbycustomerid',params]).then(function(res){
    console.log(res)
    let allComents = that.data.allComents.concat(res.mycoment)
    that.setData({
      allComents: allComents
    })
    if (res.mycoment.length == 0){
      wx.showToast({
        title: '已加载全部',
        image:'../../resource/img/tip.png'
      })
    }
  }).catch(function(err){
    console.log(err)
  })
},



  onReachBottom: function () {
    let that = this
    let currentPageNo = this.data.currentPageNo
    currentPageNo++
    that.setData({
      currentPageNo: currentPageNo
    })
    that.myReply(currentPageNo)
    
  },

  todetails:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/details?id='+id,
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})