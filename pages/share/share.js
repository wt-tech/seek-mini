// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filePath: '',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
  
    that.setData({
      filePath: options.filePath,
      id: options.id
    })
    // if (!options.filePath && !options.id){
    //   wx.navigateTo({
    //     url: '/pages/detail/detail',
    //   })
    // }
  },





// 保存图片

  saveImg:function(){
    let that = this 
    let url = that.data.filePath
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success:function(res){
        
        if (res.errMsg == "saveImageToPhotosAlbum:ok"){
          wx.showToast({
            title: '图片保存成功',
            icon:'success'
          })
        }else{
          wx.showToast({
            title: '保存失败，请重试',
            image:'../../resource/img/error.png'
          })
        }
      }
    })
  },
  

// 分享
  onShareAppMessage: function (res) {
    let id = that.data.id
    if(res.from === 'button'){
     
    }
    return {
      title: '愿你作为黑暗中的灯塔，指引TA找到回家的路',
    }
  }
})