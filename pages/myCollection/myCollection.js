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
     
      let searchList = that.data.searchList.concat(res.marks)
      for (let tmp of searchList) {
        if (tmp.seek.seekimgs) {
          tmp.seek.seekimgs = tmp.seek.seekimgs.split(',')[0]
        }
        tmp.seek.birthdate = tmp.seek.birthdate.split(' ')[0]
        tmp.seek.missDate = tmp.seek.missDate.split(' ')[0]
      }
      that.setData({
        searchList : searchList
      })
    }).catch(function(err){
     
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
  
    wx.navigateTo({
      url: '../details/details?id='+id,
    })
  }
})