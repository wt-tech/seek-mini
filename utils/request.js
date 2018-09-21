/**
 * 专门用于发送GET,POST,PUT,DELETE,FILEUPLOAD请求的文件
 */

// const baseURL = "https://www.qghls.com/seek01/"
const baseURL = "http://192.168.0.177:8888/seek01/"
// const baseURL = "http://192.168.0.102:8080/seek01/"

/*
params是一个对象,该对象的每一个属性均需要传递到后台,
在传递到后台之前,循环遍历每一个属性,将值为null和undefined
从属性中移除。这样后台就不需要再判断传进来的值
是'null'和'undefined'这样的字符串,也就不需要特殊处理了
*/
function removeNullAndUndefinedParams(params) {
  if (isNullOrUndefined(params)) {
    return null;
  }
  let newParams = deepClone(params);
  for (let property in newParams) {
    if (isNullOrUndefined(newParams[property]))
      delete newParams[property];
  }
  return newParams;
}

/*
同removeNullAndUndefinedParams作用类似,但是这个函数会递归的处理,
如果params的属性依旧是一个对象的话,会递归的移除所有'空'属性
*/
function removeNullAndUndefinedParamsRec(params) {
  if (isNullOrUndefined(params)) {
    return null;
  }
  let newParams = deepClone(params);
  for (let property in newParams) {
    if (typeof newParams[property] === 'object' && !isNullOrUndefined(newParams[property])) {
      //是非空对象
      newParams[property] = removeNullAndUndefinedParamsRec(newParams[property]);
    } else if (isNullOrUndefined(newParams[property]))//属性为空
      delete newParams[property];
  }
  return newParams;
}


/*promise对象集合*/

/*
url只写资源位置,Context及之前的都不用写
*/
function postRequest([url, params]) {
  if (params == null)
    return;
  const promise = new Promise(function (resolved, reject) {
    wx.request({
      url: urlFactory(url),
      method: 'POST',
      data: removeNullAndUndefinedParams(params),//这里没有使用递归处理参数,如果有需要,再写一个工具方法即可
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.statusCode === 200)
          resolved(res.data);//成功时,这里只返回数据,状态码没有返回
        else
          reject(res);//失败时,返回res包括httpStatusCode
      },
      fail: (res) => {//请求失败,一般应该是网络原因
        console.log(res.errMsg);
        reject(res);
      }
    });

  });
  return promise;
}


function deleteRequest([url, params]) {
  if (params == null)
    return;
  params = _deleteHiddenMethod(params);
  const promise = new Promise(function (resolved, reject) {
    wx.request({
      url: urlFactory(url),
      method: 'POST',
      data: removeNullAndUndefinedParams(params),//这里没有使用递归处理参数,如果有需要,再写一个工具方法即可
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.statusCode === 200)
          resolved(res.data);//成功时,这里只返回数据,状态码没有返回
        else
          reject(res);//失败时,返回res包括httpStatusCode
      },
      fail: (res) => {//请求失败,一般应该是网络原因
        console.log(res.errMsg);
        reject(res);
      }
    });

  });
  return promise;
}


function putRequest([url, params]) {
  if (params == null)
    return;
  params = _putHiddenMethod(params);
  console.log(url, params)
  const promise = new Promise(function (resolved, reject) {
    wx.request({
      url: urlFactory(url),
      method: 'POST',
      data: removeNullAndUndefinedParams(params),//这里没有使用递归处理参数,如果有需要,再写一个工具方法即可
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.statusCode === 200)
          resolved(res.data);//成功时,这里只返回数据,状态码没有返回
        else
          reject(res);//失败时,返回res包括httpStatusCode
      },
      fail: (res) => {//请求失败,一般应该是网络原因
        console.log(res.errMsg);
        reject(res);
      }
    });

  });
  return promise;
}




function getRequest([url, params = null]) {
  const promise = new Promise(function (resolved, reject) {
    wx.request({
      url: urlFactory(url),
      method: 'GET',
      data: removeNullAndUndefinedParams(params),//这里没有使用递归处理参数,如果有需要,再写一个工具方法即可
      success: (res) => {
        if (res.statusCode === 200)
          resolved(res.data);//成功时,这里只返回数据,状态码没有返回
        else
          reject(res);//失败时,返回res包括httpStatusCode
      },
      fail: (res) => {//请求失败,一般应该是网络原因
        console.log(res.errMsg);
        reject(res);
      }
    });

  });
  return promise;
}


/*完全等价于getRequest([url,null]),即用来发送没有参数的get请求*/
function simpleRequest(url) {
  const promise = new Promise(function (resolved, reject) {
    wx.request({
      url: urlFactory(url),
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200)
          resolved(res.data);//成功时,这里只返回数据,状态码没有返回
        else
          reject(res);//失败时,返回res包括httpStatusCode
      },
      fail: (res) => {//请求失败,一般应该是网络原因
        console.log(res.errMsg);
        reject(res);
      }
    });

  });
  return promise;
}



/*
上传文件,需要四个参数
url=>请求路径
filePath=>本地文件路径(不可以是数组,如果想上传多个文件,需多次调用该函数)
name=>后端获取文件的key值
formData=>附带的参数
*/
function fileUpload([url, filePath, name, formData = null]) {

  const promise = new Promise(function (resolved, reject) {
    wx.uploadFile({
      url: urlFactory(url),
      filePath: filePath,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: name,
      formData: removeNullAndUndefinedParams(formData),//这里没有使用递归处理参数,如果有需要,再写一个工具方法即可
      success: (res) => {
        if (res.statusCode === 200)
          resolved(JSON.parse(res.data))//这里res.data是字符串,不是js对象,和request请求返回的结果不同,感觉这是一个坑
        else
          reject(res);
      },
      fail: (res) => {
        console.log(res);
        reject(res);
      }
    });
  });

  return promise;
}




function postRequestWithJSONSchema([url, params = null]) {
  //console.log(params)
  const promise = new Promise(function (resolved, reject) {
    wx.request({
      url: urlFactory(url),
      method: 'POST',
      data: removeNullAndUndefinedParamsRec(params),
      header: {
        'Content-Type': 'application/json'
      },
      dataType:'json',
      success: (res) => {
        if (res.statusCode === 200)
          resolved(res.data);//成功时,这里只返回数据,状态码没有返回
        else
          reject(res);//失败时,返回res包括httpStatusCode
      },
      fail: (res) => {//请求失败,一般应该是网络原因
        console.log(res.errMsg);
        reject(res);
      }
    });

  });
  return promise;
}



/*
判断该值是否为空或者undefined 是返回true
*/
function isNullOrUndefined(params) {
  return params === null || typeof params === 'undefined';
}

/*
之前构造URL时总是需要写成: let url = util.baseURL + '/resources'的形式
util.baseURL 其实没必要每次都重写一遍
*/
function urlFactory(resource) {
  //console.log(baseURL + resource);
  return baseURL + resource;
}

/*
发送POST请求,添加delete 隐藏域 充做delete请求
*/
function _deleteHiddenMethod(param) {
  param._method = 'delete';
  return param;
}

/*
发送POST请求,添加put 隐藏域 充做put请求
*/
function _putHiddenMethod(param) {
  param._method = 'put';
  return param;
}

/*获取用户信息*/

/*
用户信息,到底要不要缓存在本地?
1、获取用户信息,是调用微信的API,并不会浪费自己的服务器资源
2、不缓存到本地,一直都会获得最新的信息,但每次都请求,会稍慢
3、缓存到本地,获取很快,但用户更新信息时,缓存并不会更新

感觉还是每次用到时,直接调取比较好.省事,也不需要维护...
*/

//如果用户未授权,直接调用wx.getUserInfo会直接报错
//因此该方法是需要捕获异常的,拿到返回的promise后
//必须调用.catch方法捕获异常
function getUserInfo() {
  const promise = new Promise(function (resolved, reject) {
    wx.getUserInfo({
      success: function (res) {
        resolved(res.userInfo)//成功后直接返回userInfo
        wx.setStorageSync(userInfo, res.userInfo)
      }
    });
  });
  return promise;
}


/*一个实现简单深拷贝的简单函数*/


/*仅仅用来实现对象的深复制*/
function deepClone(obj) {
  if (typeof obj === 'object' && obj != null) {
    let newObj = {};
    for (let property in obj) {
      if (typeof obj[property] === 'object' && obj[property] != null)
        newObj[property] = deepClone(obj[property]);
      else
        newObj[property] = obj[property];
    }
    return newObj;
  }
  return obj;//如果不是object类型,不予处理,直接返回该对象本身
}




// 获取系统当前的日期  YYYY-MM-DD
function formatTime(date){
  var year = date.getFullYear()
  var month = date.getMonth()+1
  var date = date.getDate()

  return [year,month,date].map(formatNumber).join('-')
}

function formatNumber(n){
  n = n.toString()
  return n[1] ? n : '0'+n
}



module.exports = {
  getRequest: getRequest,//get请求
  simpleRequest: simpleRequest,//也是get请求,只不过不需要参数 等价于getRequest([url,null])
  postRequest: postRequest,
  deleteRequest: deleteRequest,
  putRequest: putRequest,
  postRequestWithJSONSchema: postRequestWithJSONSchema,
  fileUpload: fileUpload,
  formatTime: formatTime,
  getUserInfo: getUserInfo
}


