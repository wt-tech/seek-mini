// pages/bannerdetail/bannerdetail.js
Page({

  data: {
    bannerId : null,
    src : null
  },

  onLoad: function (options) {
    let bannerId = options.bannerId;
    let src = 'http://192.168.0.177:8848/seek-back/banner/detail.html?bannerId='+bannerId;

    this.setData({
      bannerId : bannerId,
      src : src
    });
  },

})