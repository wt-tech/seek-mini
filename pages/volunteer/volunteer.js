// pages/Authentication/Authentication.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js'
import random from '../../utils/random.js'
import wxValidate from '../../utils/wxValidate.js';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zheng: [],
    fan: [],
    id: '',
    getvolunteer:true,
    addressTou:'',
    IDs:[]

  },
  addressChange: function (event) {
    let that = this
   
    var address = '';
    var regionArr = event.detail.regionArr;
    if (event.detail.regionArr[2]){
      address = regionArr[0].name + regionArr[1].name + regionArr[2].name 
      that.setData({
        IDs: [regionArr[0].id, regionArr[1].id, regionArr[2].id ]
      })
    }else{
      address = regionArr[0].name + regionArr[1].name
      that.setData({
        IDs: [regionArr[0].id, regionArr[1].id],
      })
    }
    that.setData({
      addressTou: address
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let customerId = wx.getStorageSync(constant.customerId)
    app.getUserInfo()
    that.initValidata()
    let volunteer = random.getRandomString2(5, true)

    that.setData({
      sequence: volunteer
    })
    this.getvolunteer(customerId)
    this.setData({
      id: customerId
    })
  },
// 获取认证状态
  getvolunteer: function (customerId) {
    let that = this
    let params = {
      customerId: customerId
    }
    request.getRequest(['volunteer/getvolunteer', params]).then(function (res) {
     
      if (res.volunteer) {
        if (res.volunteer.volResult == '等待审核' || res.volunteer.volResult == '审核通过') {
          that.setData({
            getvolunteer: false
          })
        }
      }

    }).catch(function (err) {
     
    })
  },


  adImg: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
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


  formSubmit: function (e) {
    let that = this
    let IDs = that.data.IDs
   
    let value = e.detail.value
    let positiveIdentityUrl = that.data.zheng
    let negativIdentityUrl = that.data.fan
    value.positiveIdentityUrl = positiveIdentityUrl
    value.negativIdentityUrl = negativIdentityUrl



    let VolunteerArea = {}
    VolunteerArea.provinceId = IDs[0];
    VolunteerArea.cityId = IDs[1];
    VolunteerArea.countyId = IDs[2];
    value.VolunteerArea = VolunteerArea
    



    value.address = that.data.addressTou + value.address
    let customer = {}
    customer.id = that.data.id
    value.customer = customer

    if (that.data.getvolunteer){
      wx.showLoading()
      if (!that.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        wx.showToast({
          title: `${error.msg} `,
          image: '../../resource/img/error.png',
          duration: 2000
        })
        return false;
      }
     
    if (!value.VolunteerArea.provinceId && !value.VolunteerArea.cityId) {
      wx.showToast({
        title: '请选择城市',
        image: '../../resource/img/error.png',
      })
      return false
    }
      
      if (value.positiveIdentityUrl.length == '0') {
        wx.showToast({
          title: '请选择正面照',
          image: '../../resource/img/error.png'
        })
      } else if (value.negativIdentityUrl.length == '0') {
        wx.showToast({
          title: '请选择反面照',
          image: '../../resource/img/error.png'
        })
      } else {
        delete value.positiveIdentityUrl
        delete value.negativIdentityUrl
        that.athentication(value)
      }
    }else{
      wx.showToast({
        title: '请勿重复申请',
      })
    }
  },


  athentication: function (params) {
    let that = this
    request.postRequestWithJSONSchema(['volunteer/savevolunteer', params]).then(function (res) {
     
      if (res.status == 'success') {
        that.saveAuthenticationImage1(res.volunteerId)
        that.saveAuthenticationImage2(res.volunteerId)
        wx.hideLoading()
        wx.showToast({
          title: '已提交，请耐心等待审核',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    }).catch(function (err) {
      wx.hideLoading();
      wx.showToast({
        title: '提交失败，请稍后再试',
      })
    })
  },

  saveAuthenticationImage1: function (id) {
    let that = this
    let positiveIdentityUrl = that.data.zheng[0]
    request.fileUpload(['volunteer/savevolunteerImage', positiveIdentityUrl, 'positiveIdentityUrl', { volunteerId: id }]).then(function (res) {
     
    }).catch(function (err) {
      
    })
  },
  saveAuthenticationImage2: function (id) {
    let that = this
    let negativIdentityUrl = that.data.fan[0]
    request.fileUpload(['volunteer/savevolunteerImage', negativIdentityUrl, 'negativIdentityUrl', { volunteerId: id }]).then(function (res) {
     
    }).catch(function (err) {
     
    })
  },



  initValidata: function () {
    const rules = {
      customerName: {
        required: true
      },
      identityNO: {
        required: true,
        idcard: true
      },
      address: {
        required: true
      },
      tel: {
        required: true,
        tel: true
      }
    }
    const messages = {
      customerName: {
        required: '请输入姓名',
      },
      identityNO: {
        required: '请填写身份证号'
      },
      address: {
        required: '请填写地址'
      },
      tel: {
        required: '请填写联系方式',
      }

    }
    this.WxValidate = new wxValidate(rules, messages)
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