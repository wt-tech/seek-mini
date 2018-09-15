//index.js
//获取应用实例
import request  from '../../utils/request.js';
import authorize from '../../utils/authorize.js';
import constant from '../../utils/constant.js';
const app = getApp();

Page({
   data: {
     endTime:'',
     IDs: [],//是要发送给后端请求的.
     address: '',
     pccIndex: [0, 0, 0],//pcc=>provinceCityCounty,三个picker选中的索引.
     provinceCityCounty: [],
    imgUrls:[],
    showModels: false,
    selected:true,
    selected1:false,
    searchList:[
      // {
      //   missName: '刘某某',
      //   gender: '女',
      //   birthdate: '2009-05-20',
      //   missDate: '2018-06-23',
      //   missDetailPlace: '某地某某公园附近'
      // },
      
    ],
    birthdate:'点击选择出生日期',
    missdate:'点击选择失踪日期',
    currentPageNo: 1,
    hasNoMoreData: false,//没有更多的数据了,默认为false.
    seekFilterParams: {
      birthdate: null,
      gender: null,
      missName: null,
      missDate: null,
      seekType: null,
      hadBrowsed: false,
      address: {},
      currentPageNo: null
    }
  },
// 页面加载
  onLoad: function () {
    let that = this
    let time = request.formatTime(new Date())
    that.setData({
      endTime: time
    })
    that.autoLocate();
    request.getRequest(['banner/listbanner']).then(function (res) {
      console.log(res)
      that.setData({
        imgUrls: res.banners
      })
    }).catch(function (err) {
      console.log(err)
    })
  },

  turnToDetailPage : function(e){
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/bannerdetail/bannerdetail?bannerId='+id
    });
  },

  onPullDownRefresh: function () {
    let page = this;
    //重置当前页数
    page.maintainPageNo(true);
    //重置noMoreData
    page.maintainHasNoMoreData(false);
    //重置seekList列表
    page.maintainSeekList(true);
    // 提示正在刷新
    wx.showLoading({
      title: '正在刷新',
    })
    // 结束隐藏loading动画
    setTimeout(function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }, 2000)

    //获取查询参数
    let params = page.prepareParams();
    //出入查询参数,获取查询列表
    page.getSeekList(params);
  },

  onReachBottom: function () {
    let page = this;
    wx.showLoading({
      title: '正在加载...',
    })
    //维护当前页数
    if (!page.maintainPageNo(false)) {//后台没有更多数据
      console.log('no more data');
      wx.hideLoading()
      wx.showToast({
        title: '没有更多数据了',
        image: '../../resource/img/tip.png'
      })
      return;
    }
    //获取查询参数
    let params = page.prepareParams();
    //出入查询参数,获取查询列表
    page.getSeekList(params);
  },

  /**
   * bool  isReset 为true,表示重置,pageNo = 1, 否则 pageNo++
   */
  maintainPageNo: function (isReset) {
    let page = this;
    let pageNo = 1;
    if(isReset){
      page.setData({
        currentPageNo: pageNo
      });
      return true;
    }
    if (page.data.hasNoMoreData)//后台已经没有更多数据了.
      return false;
    pageNo = page.data.currentPageNo + 1;
    page.setData({
      currentPageNo: pageNo
    });
    return true;
  },

  maintainHasNoMoreData: function (hasNoMoreData) {
    this.setData({
      hasNoMoreData: hasNoMoreData
    });
  },

  maintainSeekList: function (isClear, toAddList = null) {
    let page = this;
    if (isClear === true) {
      page.setData({
        searchList: []
      });
    } else {
      page.setData({
        searchList: page.data.searchList.concat(toAddList)
      });
      // for (let tmp of page.data.searchList){
      //   tmp.seekImgs.split(',')
      //   tmp.seekImgs = tmp.seekImgs[0]
      // }
    }
  },



  // 筛选遮罩层
  showModels:function(){
    let that = this
    let showModels = that.data.showModels
    that.setData({
      showModels: !showModels
    })
  },
  preventTouchMove:function(){
    let that = this 
    that.setData({
      showModels:false
    })
  },

  // 日期选择
  bindDateChange :function(e){
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      birthdate: e.detail.value
    })
  },
  bindMissDateChange:function(e){
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      missdate: e.detail.value
    })
  },



  // 筛选提交
  formSubmit:function(e){
    let that= this;
    let showModels = that.data.showModels;
    that.setData({
      showModels: !showModels
    })

    console.log(e)
    that.seekRequestSubmit(e)
  },


  parserDate:function (date) {
    var t = Date.parse(date);
    if (!isNaN(t)) {
      return new Date(Date.parse(date.replace(/-/g, "/")));
    } else {
      return new Date();
    }
  },

  convertDateFromString:function (dateString) {
    if(dateString) {
      var date = new Date(dateString);
      // var da = date.format('yyyy-MM-dd hh:mm:ss')
      return date;
    }
  },

  submit:function(params){
    request.getRequest(['seek/listseek',params]).then(function(res){
      console.log(res)
    }).catch(function(err){
      console.log(err)
    })
  },

  // 点击进入详情页
  toDetails:function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../../pages/details/details?id='+id,
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
    var columnIndex = event.detail.column;
    var index = event.detail.value;

    let provinceCityCounty = pageData.provinceCityCounty;
    let id = provinceCityCounty[columnIndex][index].id;

    // console.log('columnIndex:'+columnIndex);
    // console.log('index:'+index);
    // console.log('id:'+id);
    // console.log('IDs:' + pageData.IDs);
    // console.log('index:' + pageData.pccIndex);

    switch(columnIndex){
      case 0 :
        page.provinceColumnChange(id, provinceCityCounty);
        break;
      case 1 :
        page.cityColumnChange(id, provinceCityCounty);
        break;
      default :
        page.countyColumnChange(id, provinceCityCounty);
    }
  },

  provinceColumnChange: function (id, provinceCityCounty){
    this.pccPushCity(id, provinceCityCounty);
    provinceCityCounty[2] = [];
    this.setData({
      provinceCityCounty: provinceCityCounty
    });
  },

  cityColumnChange: function (id, provinceCityCounty) {
    this.pccPushCounty(id, provinceCityCounty);
    this.setData({
      provinceCityCounty: provinceCityCounty
    });
  },

  //do nothing
  countyColumnChange: function (id, provinceCityCounty) {
  },

  autoLocate: function () {
    authorize.getLocation(this);//最终的结果是将 自动定位的省份城市区县的 ID放在了 IDs中.
  },

  locateSuccess: function (IDs) {
    this.setData({
      IDs: IDs
    });
    this.initMultiSelector(IDs);
    this.seekRequestDefault();
  },

  addressChange: function (e) {
    let that = this
    let ids = e.detail.value
    console.log(e)
    let provinceCityCounty = that.data.provinceCityCounty
    let province = provinceCityCounty[0][ids[0]].id
    let city = provinceCityCounty[1][ids[1]].id
    if (provinceCityCounty[2][ids[2]] == undefined ){
      var conty = 0
    }else{
      var conty = provinceCityCounty[2][ids[2]].id 
    }
    console.log(province, city,conty)
    that.setData({
      IDs: [province, city, conty],
      pccIndex : ids
    })
    that.displayLocateAddress()
    console.log(ids)
  },
  // addresscolumnchange:function(event){
  //   console.log(event)
  //   var pageData = this.data
  //   var page = this;
  //   if (columnIndex == 2) return;
  //   var columnIndex = event.detail.column;
  //   var index = event.detail.value;
  // }
  /**
   * 发送get请求,获取寻亲列表
   */
  getSeekList: function (params) {
    //console.log(params);
    let page = this;
    //发送请求
    request.postRequestWithJSONSchema(['seek/listseek', params]).then(function (success) {
      console.log(success);
      wx.hideLoading()
      //1.展示数据
      page.maintainSeekList(false, success.seeks);
      //2.维护当前页数,noMoreData
      page.maintainHasNoMoreData(success.pageSize > success.seeks.length);
    }).catch(function (err) {
      console.log(err);
    });
  },

  /**
   * 点击确定按钮,发送请求
   */
  seekRequestSubmit: function (event) {
    let page = this;
    //先保存查询参数至pageData
    page.saveSeekFilter2PageData(event.detail);
    //重置当前页数
    page.maintainPageNo(true);
    //重置noMoreData
    page.maintainHasNoMoreData(false);
    //重置seekList列表
    page.maintainSeekList(true);
    //获取查询参数
    let params = page.prepareParams();
    //出入查询参数,获取查询列表
    page.getSeekList(params);
  },

  /**
   * 进入首页即发送(定位返回成功后才执行)的请求,默认发送的请求
   */
  seekRequestDefault: function () {
    let page = this;
    page.maintainPageNo(true);
    page.maintainHasNoMoreData(false);
    page.maintainSeekList(true);
    let params = page.prepareParams();//获取参数
    page.getSeekList(params);
  },

  saveSeekFilter2PageData: function (detail) {
    let page = this;
    let value = detail.value;
    var obj = {
      birthdate: value.birthdate || null,
      gender: value.gender || null,
      missName: value.missName || null,
      missDate: value.missdate || null,
      seekType: value.seekType || null,
      hadBrowsed: value.hadBrowsed.length == 1,
      address : {}
    };
    page.setData({
      seekFilterParams: obj
    });
  },
  /**
   * 准备待发送的参数
   */
  prepareParams: function () {
    let page = this;
    let seekFilterParams = page.data.seekFilterParams;
    seekFilterParams.customer = {
      id : wx.getStorageSync(constant.customerId)
    };
    //console.log(seekFilterParams);
    return page.assembleMissPosAndPageNo(seekFilterParams);
  },

  /**
   * 组装丢失省市县和当前页数信息
   */
  assembleMissPosAndPageNo: function (obj) {
    let pageData = this.data;
    //console.log(obj);
    obj.address.missProvinceId = pageData.IDs[0];
    obj.address.missCityId = pageData.IDs[1];
    obj.address.missCountyId = pageData.IDs[2];
    obj.currentPageNo = pageData.currentPageNo;
    return obj;
  },


})
