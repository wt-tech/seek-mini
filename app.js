//app.js
import request from './utils/request.js';
import constant from './utils/constant.js';
App({
  onLaunch: function () {
    this.saveCustomerId2Local();
    this.saveVisitRecord();
  },
  globalData: {
    userInfo: null
  },

  saveCustomerId2Local: function () {
    if (wx.getStorageSync(constant.customerId))//有值
      return;
    wx.login({
      success: res => {
        console.log(res);
        let uri = 'authorization/' + res.code;
        request.simpleRequest([uri]).then(function (result) {
          console.log(result);
          wx.setStorageSync(constant.customerId, result.customerId);
        }).catch(function (err) {
          console.log(err);
        });
      }
    });
  },

  saveVisitRecord: function () {
    if (!wx.getStorageSync(constant.customerId)) //无值
      return;
    let param = {
      customer: {
        id: wx.getStorageSync(constant.customerId)
      }
    }
    request.postRequestWithJSONSchema(['visitrecord', param]).then(function (result) {
      console.log(result);
    }).catch(function (err) {
      console.log(err);
    });
  }

})