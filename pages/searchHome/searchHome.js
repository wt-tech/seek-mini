// pages/searchPeople/searchPeople.js
import util from '../../utils/request.js';
import authorize from '../../utils/authorize.js';
import constant from '../../utils/constant.js';
import wxValidate from '../../utils/wxValidate.js';
import random from '../../utils/random.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据    
   */
  data: {
    IDs: [],//是要发送给后端请求的
    // address: '',
    pccIndex: [0, 0, 0],//pcc=>provinceCityCounty,三个picker选中的索引.
    pccIndex2: [0, 0, 0],
    provinceCityCounty: [],
    changeshi: [],
    birthdate: '点击选择出生日期',
    missdate: '点击选择失踪日期',
    endTime: '',
    touxiang: [],
    address: '点击选择城市',
    region: [],
    customItem: '全部',
    IDs2: [],
    sequence: '',
    status: false
  },


  //生命周期函数--监听页面加载   
  onLoad: function (options) {
    let that = this
    // that.renzheng()
    that.autoLocate();
    let time = util.formatTime(new Date())
    let getRandomString = random.getRandomString(5, false)
    that.setData({
      endTime: time,
      sequence: getRandomString
    })
    that.initValidata()
  },
  // 判断是否认证
  renzheng: function () {

    var customerId = wx.getStorageSync(constant.customerId)
    let params = {
      customerId: customerId
    }
    util.getRequest(['authentication/getAuthentication', params]).then(function (res) {
      
      if (res.status == 'fail') {
        wx.showModal({
          title: '提示',
          content: '你还没有认证，是否前往认证',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../Authentication/Authentication',
              })
            }
            if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }

          }
        })
      }else if (res.authentication.authResult == '等待认证') {
        wx.showModal({
          title: '',
          content: '您的认证正在审核，请您耐心等待',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }else if (res.authentication.authResult == '认证不通过') {
        wx.showModal({
          title: '',
          content: '您的认证未通过，请前往重新认证',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../Authentication/Authentication',
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }).catch(function (err) {
     
      wx.showToast({
        title: '加载失败...',
      }, wx.navigateBack({
        delta: 1
      })
      )
    })
  },



  initValidata: function () {
    const rules = {
      missName: {
        required: true
      },
      gender: {
        required: true
      },
      birthdate: {
        required: true
      },
      missdate: {
        required: true
      },
      missDetailPlace: {
        required: true
      },
      plot: {
        required: true
      },
      feature: {
        required: true
      },
      seekSubtype: {
        required: true
      },
      contactName: {
        required: true
      },
      contactTel: {
        required: true,
        tel:true
      },
      contactAddress: {
        required: true
      },

    }
    const messages = {
      missName: {
        required: '请输入失踪者姓名'
      },
      gender: {
        required: '请选择失踪者性别'
      },
      birthdate: {
        required: '请选择出生日期'
      },
      missdate: {
        required: '请选择失踪日期'
      },
      missDetailPlace: {
        required: '请填写详细地点'
      },
      plot: {
        required: '请填写失踪经过'
      },
      feature: {
        required: '请填写相貌特征'
      },
      seekSubtype: {
        required: '请选择失踪原因'
      },
      contactName: {
        required: '填写联系人姓名'
      },
      contactTel: {
        required: '填写联系人手机号',
      },
      contactAddress: {
        required: '请填写联系地址'
      },

    }
    this.WxValidate = new wxValidate(rules, messages)
  },



  // 选择出生日期
  bindDateChange: function (e) {
    let that = this
    
    that.setData({
      birthdate: e.detail.value
    })
  },
  // 失踪日期
  bindMissDateChange: function (e) {
    let that = this
   
    that.setData({
      missdate: e.detail.value
    })
  },

  // 选择照片
  chooseImg: function () {
    let that = this
    wx.chooseImage({
      success: function (res) {
       
        let touxiang = that.data.touxiang;
        touxiang = touxiang.concat(res.tempFilePaths);
        that.setData({
          touxiang: touxiang
        })
      },
    })
  },
  // 删除照片
  delImg: function (e) {
    let index = e.target.dataset.index;
    let touxiang = this.data.touxiang
    touxiang.splice(index, 1)
    this.setData({
      touxiang: touxiang
    })
  },


  formSubmit: function (event) {

    
    let value = event.detail.value
    let pageData = this.data
    //提交错误描述
    if (!this.WxValidate.checkForm(event)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: `${error.msg} `,
        image: '../../resource/img/error.png',
        duration: 2000
      })
      return false;
    }
    wx.showLoading({
      title: '正在提交数据',
    })
    delete value.province
    let address = {}

    address.missProvinceId = pageData.IDs[0]
    address.missCityId = pageData.IDs[1]
    address.missCountyId = pageData.IDs[2]

    address.birthProvinceId = pageData.IDs2[0]
    address.birthCityId = pageData.IDs2[1]
    address.birthCountyId = pageData.IDs2[2]
    value.address = address

    let customer = {}
    var customerId = wx.getStorageSync(constant.customerId)
    customer.id = customerId
    let seekType = "寻亲"
    value.customer = customer
    value.seekType = seekType
    value.seekImg = pageData.touxiang
    this.submit(value)
    ///////这里可以写提交方法了

  },

  gender: function (e) {
   
  },
  submit: function (e) {
    let that = this
    util.postRequestWithJSONSchema(['seek/saveseek', e]).then(function (res) {
      
      if (res.message == "请勿重复发布信息." && res.status == 'fail') {
        wx.hideLoading();
        wx.showToast({
          title: "请勿重复发布信息",
        })
      }
      if (res.status == 'success') {
        let imgPaths = that.data.touxiang
        let seekId = res.seeksId
        let i = 0
        if (imgPaths.length != '0') {
          for (let imgPath of imgPaths) {
            util.fileUpload(['seek/saveseekImg', imgPath, 'seekImg', { seekId: seekId }]).then(function (res) {
              
              wx.hideLoading()
              if (res.status == 'success') {
                i++
                
                if (i == imgPaths.length) {
                  wx.showToast({
                    title: '上传成功',
                  })
                  let timer = setTimeout(function(){
                    that.listsimilarseek(e)
                    clearTimeout(timer)
                  },1500)
                  // 
                  
                }

              }
            }).catch(function (err) {
             
              wx.showToast({
                title: '发布失败，请重试',
                duration: 2000
              })
            })
          }
        } else {
          wx.hideLoading()
          that.listsimilarseek(e)
        }

      }
      if (res.message == "请勿重复发布信息") {
        wx.hideLoading();
        wx.showToast({
          title: "请勿重复发布信息",
        })
      }


    }).catch(function (err) {
      
      wx.showToast({
        title: '发布失败，请重试',
        duration: 2000
      })
    })

  },
  // 发起匹配请求
  listsimilarseek: function (e) {
    util.postRequestWithJSONSchema(['seek/listsimilarseek', e]).then(function (res) {
     
      let similarSeeks = JSON.stringify(res.similarSeeks)
      wx.redirectTo({
        url: '../matching/matching?similarSeeks=' + similarSeeks,
      })
    }).catch(function (err) {
      
    })
  },

  


  initMultiSelector: function ([provinceId = 13, cityId = 219, countyId = 0]) {
    let provinces = wx.getStorageSync(constant.province);
    let citys = wx.getStorageSync(constant.city);
    let countys = wx.getStorageSync(constant.county);

    let provinceCityCounty = [];
    let pccIndex = [];
    provinceCityCounty.push(provinces.provinces);//省份

    citys.provinces.some((p, index) => {
      if (p.id == provinceId) {
        provinceCityCounty.push(p.cities);//城市
        pccIndex.push(index);//省份
        p.cities.some((city, index) => {
          if (city.id == cityId) {
            pccIndex.push(index);//城市
          }
        })
        return true;
      }
      return false;
    });

    countys.cities.some((city, index) => {
      if (city.id == cityId) {
        provinceCityCounty.push(city.counties);//区县
        if (countyId) {
          city.counties.some((county, index) => {
            if (county.id == countyId)
              pccIndex.push(index);//区县
          });
        }
        return true;
      }
      return false;
    });
    this.setData({
      provinceCityCounty: provinceCityCounty,
      pccIndex: pccIndex
    });
    this.displayLocateAddress();
    this.displayLocateAddress2();
  },





  /**
   * 根据IDs和provinceCityCounty展示位置
   */
  displayLocateAddress: function () {
    let data = this.data;
    let p = data.provinceCityCounty[0][data.pccIndex[0]].name;
    let city = data.provinceCityCounty[1][data.pccIndex[1]].name;

    let address = p + '-' + city;
    address = data.IDs[2] ? address + '-' + data.provinceCityCounty[2][data.pccIndex[2]].name : address;



    this.setData({
      address: address,
    });
  },

  displayLocateAddress2: function () {
    let data = this.data;
    let p = data.provinceCityCounty[0][data.pccIndex[0]].name;
    let city = data.provinceCityCounty[1][data.pccIndex[1]].name;

    if (data.provinceCityCounty[2][data.pccIndex[2]] == undefined) {
      var address2 = p + '-' + city
    } else {
      var address2 = p + '-' + city + '-' + data.provinceCityCounty[2][data.pccIndex[2]].name;

    }
    this.setData({
      address2: address2,
    });
  },


  pccPushProvince: function (provinceCityCounty) {
    let provinces = wx.getStorageSync(constant.province);
    provinceCityCounty[0] = provinces.provinces;//省份
  },

  pccPushCity: function (provinceId, provinceCityCounty) {
    let citys = wx.getStorageSync(constant.city);
    citys.provinces.some((p, index) => {
      if (p.id == provinceId) {
        provinceCityCounty[1] = p.cities;//城市
       
        this.setData({
          changeshi: provinceCityCounty[1]
        })
        return true;
      }
    });
  },

  pccPushCounty: function (cityId, provinceCityCounty) {
    let countys = wx.getStorageSync(constant.county);
    countys.cities.some((city, index) => {
      if (city.id == cityId) {
        provinceCityCounty[2] = city.counties;//区县
        return true;
      }
    });
  },
  addresscolumnchange: function (event) {
    
    var pageData = this.data
    var page = this;
    if (columnIndex == 2) return;
    var columnIndex = event.detail.column;
    var index = event.detail.value;
    var provinceCityCounty = page.data.provinceCityCounty
    let id = provinceCityCounty[columnIndex][index].id;
    if (columnIndex == 0) {

      page.pccPushCity(id, provinceCityCounty);
      page.setData({
        provinceCityCounty: provinceCityCounty
      })
      let shi = page.data.changeshi[columnIndex].id
      page.pccPushCounty(shi, provinceCityCounty)
    };
    if (columnIndex == 1) {
      page.pccPushCounty(id, provinceCityCounty)
    }
    page.setData({
      provinceCityCounty: provinceCityCounty
    })
  },
  addressChange: function (e) {
    let that = this
    let ids = e.detail.value
    
    let provinceCityCounty = that.data.provinceCityCounty
    let province = provinceCityCounty[0][ids[0]].id
    let city = provinceCityCounty[1][ids[1]].id
    // let conty = provinceCityCounty[2][ids[2]].id
    if (provinceCityCounty[2][ids[2]] == undefined) {
      
      var conty = 0
    } else {
      var conty = provinceCityCounty[2][ids[2]].id
      
    }
   
    that.setData({
      IDs: [province, city, conty],
      pccIndex: ids
    })
    that.displayLocateAddress()
   
  },



  addresscolumnchange2: function (event) {
    
    var pageData = this.data
    var page = this;
    if (columnIndex == 2) return;
    var columnIndex = event.detail.column;
    var index = event.detail.value;
    var provinceCityCounty = page.data.provinceCityCounty
    let id = provinceCityCounty[columnIndex][index].id;
    if (columnIndex == 0) {

      page.pccPushCity(id, provinceCityCounty);
      page.setData({
        provinceCityCounty: provinceCityCounty
      })
      let shi = page.data.changeshi[columnIndex].id
      page.pccPushCounty(shi, provinceCityCounty)
    };
    if (columnIndex == 1) {
      page.pccPushCounty(id, provinceCityCounty)
    }
    page.setData({
      provinceCityCounty: provinceCityCounty
    })
  },
  addressChange2: function (e) {
    let that = this
    let ids = e.detail.value
   
    let provinceCityCounty = that.data.provinceCityCounty
    let province = provinceCityCounty[0][ids[0]].id
    let city = provinceCityCounty[1][ids[1]].id
    // let conty = provinceCityCounty[2][ids[2]].id
    if (provinceCityCounty[2][ids[2]] == undefined) {
    
      var conty = 0
    } else {
      var conty = provinceCityCounty[2][ids[2]].id
     
    }
   
    that.setData({
      IDs2: [province, city, conty],
      pccIndex: ids
    })
    that.displayLocateAddress2()
   
  },



  autoLocate: function () {
    authorize.getLocation(this);//最终的结果是将 自动定位的省份城市区县的 ID放在了 IDs中.
  },

  locateSuccess: function (IDs) {
    this.setData({
      IDs: IDs,
      IDs2: IDs
    });
    this.initMultiSelector(IDs);
  },









  focus1: function () {
    this.setData({
      status1: true
    })
  },

  blur1: function () {
    this.setData({
      status1: false
    })
  },

  focus2: function () {
    this.setData({
      status2: true
    })
  },

  blur2: function () {
    this.setData({
      status2: false
    })
  },

  focus3: function () {
    this.setData({
      status3: true
    })
  },

  blur3: function () {
    this.setData({
      status3: false
    })
  },

  focus4: function () {
    this.setData({
      status4: true
    })
  },

  blur4: function () {
    this.setData({
      status4: false
    })
  },

  focus5: function () {
    this.setData({
      status5: true
    })
  },

  blur5: function () {
    this.setData({
      status5: false
    })
  },

  focus6: function () {
    this.setData({
      status6: true
    })
  },

  blur6: function () {
    this.setData({
      status6: false
    })
  },


  focus7: function () {
    this.setData({
      status7: true
    })
  },

  blur7: function () {
    this.setData({
      status7: false
    })
  },

  focus8: function () {
    this.setData({
      status8: true
    })
  },

  blur8: function () {
    this.setData({
      status8: false
    })
  },

  focus9: function () {
    this.setData({
      status9: true
    })
  },

  blur9: function () {
    this.setData({
      status9: false
    })
  },

  focus10: function () {
    this.setData({
      status10: true
    })
  },

  blur10: function () {
    this.setData({
      status10: false
    })
  },

  focus11: function () {
    this.setData({
      status11: true
    })
  },

  blur11: function () {
    this.setData({
      status11: false
    })
  },

  focus12: function () {
    this.setData({
      status12: true
    })
  },

  blur12: function () {
    this.setData({
      status12: false
    })
  },

  focus13: function () {
    this.setData({
      status13: true
    })
  },

  blur13: function () {
    this.setData({
      status13: false
    })
  },
})