/**
 * 1.授权获取用户信息
 * 2.授权获取地理位置
 */
import request from './request.js';
import locate from './auto.locate.js'; 

//获取用户信息之前首先看有没有授权
function getUserInfo(context){
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {//已经授权,直接获取userInfo
        wx.getUserInfo({
          success: res => {
            context.globalData.userInfo = res.userInfo
            if (context.userInfoReadyCallback) {
              context.userInfoReadyCallback(res)
            }
          }
        })
      }
    }
  });
}


//获取定位信息
//page指调用该函数的页面对象
function getLocation(page){
  wx.getSetting({
    success : res=>{
      if (res.authSetting['scope.userLocation']){//用户已经授权,直接调用wx.getLocation()接口.
        _getLoacation(page);
      }else{//尚未授权,提示授权
        wx.authorize({
          scope: 'scope.userLocation',
          success: function(){//同意授权
            _getLoacation(page);
          },
          fail: function (res) {//不同意授权

          }
        })
      }
    }
  });
}

function _getLoacation(page){
  wx.getLocation({
    success: function (res) {
      //获取成功后,向后台发送请求.
      let coordinate = {
        longitude:res.longitude, 
        latitude:res.latitude
      };
      request.getRequest(['locatePosition',coordinate]).then(function(result){
        //解析result
        let IDs = locate.parseAddressInfo(result.address);
        if (page.locateSuccess){
          page.locateSuccess(IDs);
        }
      }).catch(function(err){
        console.log('网络出错...');
      });
    }
  });
}

function abc () {
  if (app.globalData.userInfo) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  } else if (this.data.canIUse) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
  } else {
    // 在没有 open-type=getUserInfo 版本的兼容处理
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }
}

module.exports={
  getLocation: getLocation
}