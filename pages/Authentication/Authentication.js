// pages/Authentication/Authentication.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zheng : [],
    fan :[],
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo()
    let customerId =  wx.getStorageSync(constant.customerId)
    this.setData({
      id: customerId
    })
  },

  adImg:function(){
    let that = this
    wx.chooseImage({
      count:1,
      success: function(res) {
        let adImg = res.tempFilePaths
        that.setData({
          zheng: adImg
        })
      },
    })
  },

  adImg2: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let adImg = res.tempFilePaths
        that.setData({
          fan: adImg
        })
      },
    })
  },


formSubmit:function(e){
  let that = this
  console.log(e)
  let value = e.detail.value
  let positiveIdentityUrl = that.data.zheng
  let negativIdentityUrl = that.data.fan
  value.positiveIdentityUrl = positiveIdentityUrl
  value.negativIdentityUrl = negativIdentityUrl
  let customer = {}
  customer.id = that.data.id
  value.customer = customer
  if (value.customerName == ''){
    wx.showToast({
      title: '请填写姓名',
      image:'../../resource/img/error.png'
    })
  }else if(value.identityNO == '') {
    wx.showToast({
      title: '请填写身份证号',
      image: '../../resource/img/error.png'
    })
  }else if(value.address == ''){
    wx.showToast({
      title: '请填写联系地址',
      image: '../../resource/img/error.png'
    })
  }else if (value.tel == ''){
    wx.showToast({
      title: '请填写联系电话',
      image: '../../resource/img/error.png'
    })
  } else if (value.positiveIdentityUrl.length == '0'){
    wx.showToast({
      title: '请选择正面照',
      image: '../../resource/img/error.png'
    })
  } else if (value.negativIdentityUrl.length == '0'){
    wx.showToast({
      title: '请选择反面照',
      image: '../../resource/img/error.png'
    })
  }else {
    delete value.positiveIdentityUrl
    delete value.negativIdentityUrl
    that.athentication(value)
  }
},


  athentication:function(params){
    let that = this
    request.postRequestWithJSONSchema(['authentication/saveAuthentication',params]).then(function(res){
      console.log(res)
      if(res.status == 'success'){
        that.saveAuthenticationImage1(res.authenticationId)
        that.saveAuthenticationImage2(res.authenticationId)
        wx.showToast({
          title: '已提交，请耐心等待审核',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta:1
          })
        }, 1500)
      }
    }).catch(function(err){
      console.log(err)
    })
  },

  saveAuthenticationImage1:function(id){
    let that = this
    let positiveIdentityUrl = that.data.zheng[0]
    request.fileUpload(['authentication/saveAuthenticationImage', positiveIdentityUrl, 'positiveIdentityUrl', { authenticationId: id }]).then(function(res){
      console.log(res)
    }).catch(function(err){
      console.log(err)
    })
  },
  saveAuthenticationImage2: function(id) {
    let that = this
    let negativIdentityUrl = that.data.fan[0]
    request.fileUpload(['authentication/saveAuthenticationImage', negativIdentityUrl, 'negativIdentityUrl', { authenticationId: id }]).then(function (res) {
      console.log(res)
    }).catch(function (err) {
      console.log(err)
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