/**
 * 自动定位地址的解析
 * 首页需要使用一次.
 */
import constant from './constant.js';


const city = 'cities';
const province = 'provinces';
const county = 'counties';
const specialCity = ['北京', '天津', '上海', '重庆', '香港', '澳门'];

/**
 * addressInfo后台传过来的数据
 * 格式如下:
 * address: {
      "street": "包河大道",
      "province": "安徽省",
      "street_number": "包河大道118号",
      "district": "包河区",
      "nation": "中国",
      "city": "合肥市"
  }
 */
function parseAddressInfo(addressInfo) {
  var IDs = [];

  if (addressInfo) {
    findProvinceID(addressInfo, IDs);
    findCityID(addressInfo, IDs);
    findCountyID(addressInfo, IDs);
  }
  return IDs;
}


function findProvinceID(addressInfo, IDs) {
  let pro_address = addressInfo.province;
  let pro = wx.getStorageSync(constant.province).provinces;
  //大海捞针,在所有的省份中查找
  for (let p in pro) {
    if (-1 != pro_address.search(pro[p].name)) {//查到
      IDs.push(pro[p].id);
      return;
    }
  }
}

function findCityID(addressInfo, IDs) {
  let city_address = addressInfo.city;
  let cit = wx.getStorageSync(constant.city).provinces;

  if (constant.specialCity.some(city => city_address === city)) {//true 说明是直辖市或港澳
    city_address = addressInfo.district;
  }
  //根据省的id查找城市
  for (let c in cit) {
    if (cit[c].id === IDs[0]) {//找到对应的省份
      let cities = cit[c].cities;
      for (let co in cities) {
        if (-1 != city_address.search(cities[co].name)) {//匹配到对应的城市
          IDs.push(cities[co].id);
          break;
        }
      }
      break;
    }
  }
}


function findCountyID(addressInfo, IDs) {
  let pro_address = addressInfo.province;
  let city_address = addressInfo.city;
  if (pro_address === city_address) {//直辖市
    return;
  }
  let county_address = addressInfo.district;
  let cou = wx.getStorageSync(constant.county).cities;
  //根据cityID查找 county

  for (let co in cou) {
    if (IDs[1] === cou[co].id) {//找到对应的城市
      let counties = cou[co].counties;
      for (let index in counties) {
        if (-1 != county_address.search(counties[index].name)) {//查找到区县
          IDs.push(counties[index].id);
          break;
        }
      }
      break;
    }
  }
}

module.exports={
  parseAddressInfo: parseAddressInfo
}