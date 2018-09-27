// pages/my/my.js
import util from '../../utils/request.js';
import constant from '../../utils/constant.js';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    renzed:'',
    message:'',
    phoneCall:'0551--65590880',
    getvolunteer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var customerId = wx.getStorageSync(constant.customerId)
    that.renzheng(customerId)
    that.message(customerId)
    that.getvolunteer(customerId)
  },


// 获取是否有新消息
  message: function (customerId) {
    let that = this
    let params ={
      customerId: customerId
    }
  util.getRequest(['message/getmessage',params]).then(function(res){
    console.log(res)
    if(!res){
      that.setData({
        message : false
      })
    }else{
      that.setData({
        message: true
      })
    }
  }).catch(function(err){
    console.log(err)
  })
},

// 获取认证状态
  renzheng: function (customerId) {
    let that = this
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

// 获取志愿者状态
  getvolunteer: function (customerId){
    let that = this
    let params = {
      customerId: customerId
    }
    console.log(params)
    util.getRequest(['volunteer/getvolunteer', params]).then(function(res){
    console.log(res)
      if (res.volunteer){
        if (res.volunteer.volResult == '等待审核') {
          that.setData({
            getvolunteer: res.volunteer.volResult
          })
        } else if (res.volunteer.volResult == '审核通过') {
          that.setData({
            getvolunteer: res.volunteer.volResult
          })
        } else if (res.volunteer.volResult == '审核不通过'){
          that.setData({
            getvolunteer: res.volunteer.volResult
          })
        }
      }
      
  }).catch(function(err){
    console.log(err)
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
      url: '../../pages/volunteer/Notes',
    })
  },
// 使用须知
  Notes:function(){
    wx.navigateTo({
      url: '../../pages/know/know',
    })
  },

// 电话
  Contact:function(){
    let phoneCall = this.data.phoneCall
    wx.makePhoneCall({
      phoneNumber: phoneCall,
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
      let that = this
      var customerId = wx.getStorageSync(constant.customerId)
      that.renzheng(customerId)
      that.message(customerId)
      that.getvolunteer(customerId)
       app.getUserInfo()
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