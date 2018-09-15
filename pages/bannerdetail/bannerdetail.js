// pages/bannerdetail/bannerdetail.js
Page({

  data: {
    bannerId : null,
    src : null
  },

  onLoad: function (options) {
    let bannerId = options.bannerId;
    let src = 'http://127.0.0.1:8848/seek-back/banner/detail.html?bannerId='+bannerId;

    this.setData({
      bannerId : bannerId,
      src : src
    });
  },

})