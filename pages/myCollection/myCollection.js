// pages/myCollection/myCollection.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPageNo:1,
    searchList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var customerId = wx.getStorageSync(constant.customerId)
    that.setData({
      id: customerId
    })
    let currentPageNo = that.data.currentPageNo
    that.getmark(customerId, currentPageNo)
  },

  getmark:function(id,page){
    let that = this
    let params = {
      customerId: id,
      currentPageNo: page
    }
    request.getRequest(['mark/listmark', params]).then(function(res){
      console.log(res)
      let searchList = that.data.searchList.concat(res.marks)
      that.setData({
        searchList : searchList
      })
    }).catch(function(err){
      console.log(err)
    })
  },

 onReachBottom:function(){
   let that = this
   let id = that.data.id
   let page = that.data.currentPageNo
   page++ 
   that.setData({
     currentPageNo: page
   })
   that.getmark(id, page)
 },
  toDetails:function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../details/details?id='+id,
    })
  }
})