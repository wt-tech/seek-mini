// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    animationData:{},
    animationData2: {},
    checkOpacity:0,
    checkBtnOpaity:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    });
    animation.opacity(1).translateY(60).scale(1.1).backgroundColor('#e1e1e1').step();
    let animation2 = wx.createAnimation({
      // transformOrigin:"50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0,
    });
    animation2.opacity(1).translateY(0).scale(1).backgroundColor('#ffffff').step();

    this.setData({
      checkBtnOpacity: 0,
      bgcolor: true,
      animationData: animation2.export(),
      animationData2: animation.export()
    })

  },


  // searchPeople:function(){
  //   wx.navigateTo({
  //     url: './releaseNotes/releaseNotes?searchPeople=true',
  //   })
  // },

  // searchHome:function(){
  //   wx.navigateTo({
  //     url: './releaseNotes/releaseNotes?searchPeople=false',
  //   })
  // },

  bindcheck:function(e){
    this.animation()
   
  },


  bindcheck2: function (e) {
    this.animation2()
  },

animation:function(){
  let animation = wx.createAnimation({
    // transformOrigin:"50% 50%",
    duration: 500,
    timingFunction: "ease",
    delay: 0,
  });
  animation.opacity(1).translateY(-60).scale(1.1).backgroundColor('#e1e1e1').step();

  let animation2 = wx.createAnimation({
    duration: 500,
    timingFunction: "ease",
    delay: 0,
  });
  animation2.opacity(1).translateY(0).scale(1).backgroundColor('#ffffff').step();

  this.setData({
    checkBtnOpacity: 0,
    animationData2: animation2.export(),
    animationData: animation.export()
  })
    // setTimeout(function(){
    //   wx.navigateTo({
    //     url: './releaseNotes/releaseNotes?searchPeople=false',
    //   })
    // }, 600)
},
animation2:function(){
  let animation = wx.createAnimation({
    duration: 500,
    timingFunction: "ease",
    delay: 0,
    
  });
  animation.opacity(1).translateY(60).scale(1.1).backgroundColor('#e1e1e1').step();
  let animation2 = wx.createAnimation({
    // transformOrigin:"50% 50%",
    duration: 500,
    timingFunction: "ease",
    delay: 0,
  });
  animation2.opacity(1).translateY(0).scale(1).backgroundColor('#ffffff').step();

  this.setData({
    checkBtnOpacity: 0,
    animationData: animation2.export(),
    animationData2: animation.export()
  })
    // setTimeout(function () {
    //   wx.navigateTo({
    //     url: './releaseNotes/releaseNotes?searchPeople=true',
    //   })
    // }, 600)
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