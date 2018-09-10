// pages/myReleased/myReleased.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList:[],
    currentPageNo: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listseekbycustomerid()
  },


  listseekbycustomerid: function (currentPageNo){
    let that = this
    var customerId = wx.getStorageSync(constant.customerId)
    let pages = currentPageNo || 1
    let params ={
      customerId: customerId,
      currentPageNo: pages
    }
    request.getRequest(['seek/listseekbycustomerid', params]).then(function(res){
      console.log(res)
      if(res.status == 'success'){
        let searchList = that.data.searchList.concat(res.seeks)
        console.log(searchList)
        that.setData({
          searchList: searchList
        })
      }
      if(res.seeks.length==0){
        wx.showToast({
          title: '已加载全部',
          image:'../../resource/img/tip.png'
        })
      }
    }).catch(function(err){
      console.log(err)
    })
  },


  onReachBottom:function(){
    let that = this
    let currentPageNo = that.data.currentPageNo
    currentPageNo++
    that.setData({
      currentPageNo: currentPageNo
    })
    that.listseekbycustomerid(currentPageNo)

  },

  // 点击进入详情页
  toDetails: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../details/details?id=' + id,
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