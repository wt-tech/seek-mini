// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName:'',
    content:'',
    tel:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 详情的id
    let id = options.detailId
    let replyId = options.replyId
    
  },


  formSubmit:function(e){
    let value = e.detail.value
    console.log(value)
    if (value.content == ''){
      wx.showToast({
        title: '线索不能为空',
        image:'../../resource/img/error.png'
      })
    }else if(value.realName == ''){
      wx.showToast({
        title: '请填写姓名',
        image: '../../resource/img/error.png'
      })
    }else if(value.tel == ''){
      wx.showToast({
        title: '请填写联系方式',
        image: '../../resource/img/error.png'
      })
    }else {
      // 发起请求



    }
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