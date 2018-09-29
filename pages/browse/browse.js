// pages/browse/browse.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList:[],
    currentPageNo: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var customerId = wx.getStorageSync(constant.customerId)
    let page = that.data.currentPageNo
    that.setData({
      id: customerId
    })
    that.browse(customerId, page)
  },

// 请求浏览记录
  browse: function (id, page){
    let that = this
    let params ={
      customerId: id,
      currentPageNo: page
    }
    request.getRequest(['browsehistory/listbrowsehistory', params]).then(function (res) {
     
      let searchList = that.data.searchList.concat(res.browsehistorys)
      
        for (let tmp of searchList) {
          if (tmp.seek.seekimgs) {
            tmp.seek.seekimgs = tmp.seek.seekimgs.split(',')[0]
          }

          tmp.seek.birthdate = tmp.seek.birthdate.split(' ')[0]
          tmp.seek.missDate = tmp.seek.missDate.split(' ')[0]
        }
      
      that.setData({
        searchList: searchList
      })
      if (res.browsehistorys.length == 0){
        wx.showToast({
          title: '已加载全部...',
          image:'../../resource/img/tip.png'
        })
      }
    }).catch(function(err){
      
    })
  },

 onReachBottom:function(){
   let that = this
   let id = that.data.id
   let page = that.data.currentPageNo
   page ++ 
   that.setData({
     currentPageNo : page
   })
   that.browse(id,page)
 }
})