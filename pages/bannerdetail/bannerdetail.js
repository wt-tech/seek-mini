// pages/bannerdetail/bannerdetail.js
Page({

  data: {
    bannerId : null,
    src : null
  },

  onLoad: function (options) {
    let bannerId = options.bannerId;
    let src = 'https://www.qghls.com/seek-back/banner/detail.html?bannerId='+bannerId;
    console.log(src);
    this.setData({
      bannerId : bannerId,
      src : src
    });
  },

})