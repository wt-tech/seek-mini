//app.js
import request from './utils/request.js';
import constant from './utils/constant.js';
import initaddress from './utils/init.address.js'
App({
  onLaunch: function () {
    this.saveCustomerId2Local();
    this.saveVisitRecord();
  },
  globalData: {
    userInfo: null
  },

  saveCustomerId2Local: function (userInfo) {

  // userInfo存在表示当前点击了允许授权，向后台发送用户信息
    if (userInfo) {
      // let userInfo = wx.getStorageSync(userInfo)
      var id = wx.getStorageSync(constant.customerId)
      let nickname = userInfo.nickName;
      let gender = userInfo.gender;
      let avatarurl = userInfo.avatarUrl;
      let params = {
        id: id,
        nickname: nickname,
        gender: gender ==1 ?'男':'女',
        avatarurl: avatarurl
      }
      request.putRequest(['customer', params]).then(function (res) {

      }).catch(function (err) {

      })
    }


    if (wx.getStorageSync(constant.customerId) && typeof(wx.getStorageSync(constant.customerId)) == 'number')//有值
      return;
    wx.login({
      success: res => {
        let uri = 'authorization/' + res.code;
        request.simpleRequest([uri]).then(function (result) {
          wx.setStorageSync(constant.customerId, result.customerId);
        }).catch(function (err) {
          
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
     
    }).catch(function (err) {
     
    });
  },

  getUserInfo :function () {
    let _userInfo = wx.getStorageSync('uerInfo')
    if(!_userInfo){
      wx.getUserInfo({
        success: function (res) {
          wx.setStorageSync("userInfo", res.userInfo)
          
        },
        fail: function (e) {
          wx.showModal({
            title: '授权',
            content: '您还没有授权，请您授权',
            success:function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: "/pages/authorize/authorize",
                })
              }else{
                wx.switchTab({
                  url: '/tabs/index/index'
                })

              }
            }
          })
          
          return false
        }
      })
    }

  },

})