// pages/searchPeople/searchPeople.js
import util from '../../utils/request.js';
import authorize from '../../utils/authorize.js';
import constant from '../../utils/constant.js';
import wxValidate from '../../utils/wxValidate.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据    
   */
  data: {
    IDs: [],//是要发送给后端请求的.
    // address: '',
    pccIndex: [0, 0, 0],//pcc=>provinceCityCounty,三个picker选中的索引.
    provinceCityCounty: [],
    changeshi: [],
    birthdate: '点击选择出生日期',
    missdate: '点击选择失踪日期',
    endTime:'',
    touxiang:[],
    address: '点击选择城市'
  },

  
//生命周期函数--监听页面加载   
  onLoad: function (options) {
    let that = this
    that.autoLocate();
    let time = util.formatTime(new Date())
    that.setData({
      endTime: time
    })

    that.initValidata()
 
  },


  initValidata:function(){
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
      contactName:{
        required:true
      },
      contactTel:{
        required:true
      },
      contactAddress:{
        required:true
      },
      relationship:{
        required:true
      }
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
        tel:true
      },
      contactAddress: {
        required: '请填写联系地址'
      },
      relationship: {
        required: '请填写与联系人关系'
      }
    }
    this.WxValidate = new wxValidate(rules, messages)
  },



// 选择出生日期
  bindDateChange: function (e) {
    let that = this
    console.log(Date)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      birthdate: e.detail.value
    })
  },
  // 失踪日期
  bindMissDateChange: function (e) {
    let that = this
    console.log(Date)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      missdate: e.detail.value
    })
  },

// 上传照片
  chooseImg:function(){
    let that = this
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        let touxiang = that.data.touxiang;
        touxiang = touxiang.concat(res.tempFilePaths);
        that.setData({
          touxiang: touxiang
        })
      },
    })
  },
// 删除照片
  delImg:function(e){
    let index = e.target.dataset.index;
    let touxiang = this.data.touxiang
    touxiang.splice(index,1)
    this.setData({
      touxiang: touxiang
    })
  },


  formSubmit: function (event){
    // console.log(event)
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

    ///////这里可以写提交方法了
  
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
      address: address
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
        console.log(provinceCityCounty[1])
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
    console.log(event)
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
    console.log(e)
    let provinceCityCounty = that.data.provinceCityCounty
    let province = provinceCityCounty[0][ids[0]].id
    let city = provinceCityCounty[1][ids[1]].id
    let conty = provinceCityCounty[2][ids[2]].id
    console.log(province, city, conty)
    that.setData({
      IDs: [province, city, conty],
      pccIndex: ids
    })
    that.displayLocateAddress()
    console.log(ids)
  },
  autoLocate: function () {
    authorize.getLocation(this);//最终的结果是将 自动定位的省份城市区县的 ID放在了 IDs中.
  },

  locateSuccess: function (IDs) {
    // this.setData({
    //   IDs: IDs
    // });
    this.initMultiSelector(IDs);
  },
})