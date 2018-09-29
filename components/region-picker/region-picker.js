// components/region-picker/region-picker.js
import adddress from './init.address.js';
Component({


  properties: {

  },

  data: {
    //长度为3的数组,region[0]存放所有的省份,
    //region[1]存放选中省份下的所有城市,
    //region[2]存放选中城市下的所有区县
    region : [null,null,null],
    regionIndex: [0, 0, 0],//长度为3的数组,分别存放region中选中的下标
    position : '请选择地区',
    cssClass : 'fontGray'
  },



  ready : function(){//根据regionIndex初始化region
    this._initRegionWithRegionIndex();
  },

  methods: {
    /**
     *自定义事件
     */
    regionChangeListener : function(event){
      this.refreshPosition(event.detail.value);
      this.triggerEvent('change', this._prepareEventDetail(event.detail.value), { bubbles: false });
    },

    refreshPosition : function(value){
      let regionArr = this._prepareRegionArr(value);
      let position = null;
      if(regionArr[2]===null)//直辖市,特别行政区
        position = regionArr[0].name + '-' + regionArr[1].name;
      else//省份
        position = regionArr[0].name + '-' + regionArr[1].name + '-' + regionArr[2].name;
      this.setData({
        position: position,
        cssClass: 'notExistsCssClass'
      });
    },

    _prepareRegionArr: function (value){
      let [provinceIndex, cityIndex, countyIndex] = value;
      let region = this.data.region;
      let regionArr = [];

      regionArr.push(region[0][provinceIndex]);
      regionArr.push(region[1][cityIndex]);
      regionArr.push(region[2].length == 0 ? null : region[2][countyIndex]);
      return regionArr;
    },
    _prepareEventDetail: function (value){
      return {
        indexArr: value,
        regionArr: this._prepareRegionArr(value)
      };
    },

    regionColumnChange : function(event){

      let pageData = this.data;
      let page = this;
      let columnIndex = event.detail.column;
      let index = event.detail.value;

      switch (columnIndex) {
        case 0:
          page.provinceColumnChange(index);
          break;
        case 1:
          page.cityColumnChange(index);
          break;
        default:
          page.countyColumnChange(index);
      }
    },
    provinceColumnChange:function(index){
      this.setData({
        regionIndex: [index, 0, 0]
      });
      //省份列变化时,加载对应城市至region 同时置regionIndex的2,3项为0
      this._setRegionCities(this._getCitiesByProvinceIndex(index));
      //还需要加载对应的区县
      this._setRegionCounties(this._getCountiesByCityIndex(0));
      this.setData({
        regionIndex: [index, 0, 0]
      });
    },
    cityColumnChange: function (index) {
      this._setRegionCounties(this._getCountiesByCityIndex(index));
      let regionIndex = this.data.regionIndex;
      this.setData({
        regionIndex : [regionIndex[0],index,0]
      });
    },
    countyColumnChange: function (index) {
      //just do nothing
    },

    _initRegionWithRegionIndex : function(){
      this._setRegionProvinces(this._getProvinces());
      this._setRegionCities(this._getCitiesByProvinceIndex(this.data.regionIndex[0]));
      this._setRegionCounties(this._getCountiesByCityIndex(this.data.regionIndex[1]));
    },

    _getProvinces : function(){
      return wx.getStorageSync('provinces1').allProvinces;
    },

    _getCitiesByProvinceIndex:function(provinceIndex){
      let provinces = [];
      provinces = wx.getStorageSync('provinces1').allProvinces;
      let provinceID = provinces[provinceIndex].id;
      return this._getCitiesByProvinceID(provinceID);
    },

    _getCitiesByProvinceID:function(provinceID){
      //从缓存中获取所有省份下的所有城市
      let allCities = wx.getStorageSync('cities1').allCities;
      let cities = [];//最终找到的cities
      //大海捞针,找到provinceID下的cities
      allCities.some(function(element){
        if (element.id == provinceID) {//捞到了
            cities = element.cities;
            return true;
          }
          return false;
      })
      return cities;
    },

    //前提是region[1]中已经存在cities,否则直接返回[]
    _getCountiesByCityIndex : function(cityIndex){
      if(!this.data.region[1] || this.data.region[1].length === 0)
        return [];
      return this._getCountiesByCityID(this.data.region[1][cityIndex].id)
    },

    _getCountiesByCityID : function(cityID){
      let allCounties = wx.getStorageSync('counties1').allCounties;
      let counties = [];
      allCounties.some(function(element){
        if(element.id == cityID){
          counties = element.counties;
          return true;
        }
        return false;
      });
      return counties;
    },

    _setRegionProvinces : function(provinces){
      let region = this.data.region;
      region[0] = provinces;
      this.setData({
        region : region
      });
    },
    _setRegionCities: function (cities) {
      let region = this.data.region;
      region[1] = cities;
      this.setData({
        region: region
      });
    },
    _setRegionCounties: function (counties) {
      let region = this.data.region;
      region[2] = counties;
      this.setData({
        region: region
      });
    },
  }
})
