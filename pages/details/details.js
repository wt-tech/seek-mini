// pages/details/details.js
import request from '../../utils/request.js'
import constant from '../../utils/constant.js';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:[],
    collectioned:false,
    currentPageNo: 1,
    content:{
    },
    hasNoMoreData : false,
    imgUrls: [],
    id:'',
    customer : {},
    filePath:'',
    markHide:false,
    searchLogo:'/pages/resource/img/searchLogo3.jpg',
    src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('***********************',options)
    if (options.scene){
      console.log(options.scene)
      const scene = decodeURIComponent(options.scene)
      that.setData({
        id : scene
      })
    }

    
    let currentPageNo = that.data.currentPageNo
    let customer = {}
    var customerId = wx.getStorageSync(constant.customerId)
    customer.id = customerId
    let id = options.id
    that.setData({
      customer: customer,
      id : id
    })
    
    that.loadDetail(id, currentPageNo)

    let params = {
      customerId: customerId,
      seekId : id
    }
    that.getmark(params) 
    that.browse()   //向后台插入浏览记录

  },

// 绘制页面二维码
pageImg:function(){
  var that = this
  request.getRequest(['code/accesstoken']).then(function(res){
      var reCode = res.result.split(',')[0];
      var code = reCode.split(':')[1]
      if(res.status == 'success'){
        that.token(code.split('"')[1])
      }
  }).catch(function(err){
    console.log(err)
  })
},

token:function(a){
  var that = this;
  var id = that.data.id
  // wx.request({
  //   url: 'http://192.168.0.177:8888/seek/code/wxcode',
  //   // url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+a,
  //   data:{
  //     access_token: a,
  //     scene: id,
  //     page:'pages/details/details',
  //   },
  //   method: "GET",
  //   header: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   // responseType: 'arraybuffer',
  //   success: function (res) {
  //     console.log(res.data)
  //     var resData = res.data
  //     // var resData = res.data.split('"')[1]
      
  //     var src = wx.arrayBufferToBase64(resData)
  //     src = src.replace(/\s+/g, "");
  //     src = src.replace(/<\/?.+?>/g, "");
  //     src = src.replace(/[\r\n]/g, "");
  //     that.setData({
  //       src:  "data:image/png;base64,"+src
  //     })
  //     // 当二维码的请求全部结束之后调用canvas绘制图片
  //     that.shareImg2()
  //   },
  //   fail: function (err) {
  //     console.log(err)
  //   }
  // })


  // =========================================


  var params = {
    access_token:a,
    scene:id,
    path:'pages/details/details',
  }
  // "14_Yez0o24wwT_QsXB9Qkx8vSZT-wTXLw1Mg8J6FDhwt677vECvDFFxiJZ4mjnr4w8FwoEXkSHnXs4yfu3YFBZ891TbEI5Zzh4EqiPKg5IUR87aHoCVCmJG9D0QY5IXLDiAJADRJ"
  request.postRequest(['code/wxcode',params]).then(function(res){    
    if(res.status == 'success'){
      console.log(res)
      // 当二维码的请求全部结束之后调用canvas绘制图片
      // that.setData({
      //   src : res.url
      // })
      that.shareImg2(res.url)
    }
  }).catch(function(err){
    console.log(err)
  })
},




// 加载详情数据
  loadDetail: function (id, currentPageNo){
    let that = this
    if (that.data.hasNoMoreData){
      wx.showToast({
        title: '没有更多数据了',
        image: '../../resource/img/tip.png'
      });
      return;
    }
    let params={
      id : id,
      currentPageNo: currentPageNo
    }
    request.postRequest(['seek/getseek',params]).then(function(res){
      let content = res.seekcontent
   

      // 获取第一张图片的信息，为canvas生成图片准备,如果没有图片就用默认的图片
      if (content.seekimgs){
        wx.getImageInfo({
          src: content.seekimgs.split(',')[0],
          success: function (res) {
            let path = res.path
            that.setData({
              imgPath: path
            })
          }
        })
      }       

      if (content.seekimgs!=null) {
        let imgUrls = []
        imgUrls = content.seekimgs.split(',')
        that.setData({
          content: content,
          imgUrls: imgUrls
        })
      }else {
        that.setData({
          content: content,
          imgUrls: ['../../resource/img/searchLogo3.jpg']
        })
      }

      wx.hideLoading()

      if (res.topComents.length!=0 ){
        let coment = []
        let comment = that.data.comment
     
        coment = comment.concat(res.topComents)
        that.setData({
          comment: coment
        })
       
      } else if (res.topComents.length ===0 && currentPageNo > 1){
        wx.showToast({
          title: '没有更多数据了',
          image:'../../resource/img/tip.png'
        });
        that.setData({
          hasNoMoreData : true
        });
      }
      
    }).catch(function(err){
    
    })
  },

// 保存浏览记录
  browse:function(){
    let that = this
    let customer = that.data.customer
    let seek = {}
    seek.id = Number(that.data.id)
    let params = {
      customer: customer,
      seek : seek
    }
    request.postRequestWithJSONSchema(['browsehistory/savebrowsehistory',params]).then(function(res){
    
    }).catch(function(err){
    
    })
  },

// 分享，开始请求二维码
  shareImg:function(){
    let that = this
    that.pageImg()
  
  },
// 绘制canvas
shareImg2:function(src){
  var that = this
  const ctx = wx.createCanvasContext('myCanvas')
  // 获取当前的信息

  let content = that.data.content

  let name = content.missName
  let missdata = content.missDate
  let missadd = content.missDetailPlace
  let feature = content.feature



  // 设置背景颜色以及图片大小位置
  ctx.setFillStyle('#fff')
  ctx.fillRect(0, 0, 360, 600)
  // ctx.setStrokeStyle("#00ff00")
  ctx.rect(0, 0, 360, 560)

  // 获取图片，没有就绘制指定的图片
  if (that.data.imgPath) {
    ctx.drawImage(that.data.imgPath, 0, 0, 360, 360)
  } else {
    ctx.drawImage('../../resource/img/searchLogo3.jpg', 0, 0, 360, 360)
  }
  // 填充小程序码,该小程序码是本地图片
  // ctx.drawImage('../../resource/img/hbxr.jpg', 15, 505, 90, 90)


  // 绘制当前页面的二维码
  // const src = that.data.src;
  ctx.drawImage("https://www.qghls.com/statics/seek/seek-img/84.jpg", 10, 500, 90, 90)


  // 填充文本
  ctx.setFontSize(14)
  ctx.setFillStyle('#000000')
  ctx.fillText('姓名：' + name, 15, 390)
  ctx.fillText('失踪时间：' + missdata, 15, 410)
  ctx.fillText('失踪地点：' + missadd, 15, 430)
  ctx.fillText('相貌特征：', 15, 450)

  ctx.fillText('扫码关注，帮助更多人与家人团聚', 105, 550)


  var text = feature    //这是要绘制的文本
  var chr = text.split("")

  var temp = ""
  var row = []
  for (var a = 0; a < chr.length; a++) {
    if (ctx.measureText(temp).width < 260) {
      temp += chr[a];
    }
    else {
      a--; //这里添加了a-- 是为了防止字符丢失，
      row.push(temp);
      temp = "";
    }
  }
  row.push(temp);
  //如果数组长度大于2 则截取前两个
  //2取前两行3取前三行
  if (row.length > 2) {
    var rowCut = row.slice(0, 3);
    var rowPart = rowCut[1];
    var test = "";
    var empty = [];
    for (var a = 0; a < rowPart.length; a++) {
      if (ctx.measureText(test).width < 220) {
        test += rowPart[a];
      }
      else {
        break;
      }
    }
    empty.push(test);
    // var group = empty[0] + "..."//这里只显示两行，超出的用...表示
    // rowCut.splice(2, 2, group);//1,1在第二行开始有省略号。2,2在第三行有省略号
    row = rowCut;
  }
  for (var b = 0; b < row.length; b++) {
    ctx.fillText(row[b], 75, 450 + b * 20);
  }


  ctx.draw(true, setTimeout(function () {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 500,
      height: 800,
      destWidth: 1500,
      destHeight: 2400,
      canvasId: 'myCanvas',
      success: function (res) {
        that.setData({
          filePath: res.tempFilePath,
          markHide: true
        })

      }
    })
  }, 100))
},



// 保存图片到相册
  saveImg: function () {
    let that = this
    let url = that.data.filePath
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: function (res) {
     
        if (res.errMsg == "saveImageToPhotosAlbum:ok") {
          wx.showToast({
            title: '图片保存成功',
            icon: 'success'
          })
          that.setData({
            markHide:false
          })
        } else {
          wx.showToast({
            title: '保存失败，请重试',
            image: '../../resource/img/error.png'
          })
        }
      }
    })
  },

// 上拉加载
  onReachBottom:function(){
    let that = this
    let id = that.data.id

    if (that.data.comment.length != '0') {
      wx.showLoading({
        title: '正在加载...',
      })
      let currentPageNo = that.data.currentPageNo
      currentPageNo++
      that.setData({
        currentPageNo: currentPageNo
      })
      that.loadDetail(id, currentPageNo)
    }

  },

  // 图片预览
  previewImg:function(e){
   
    let index = e.currentTarget.dataset.index
    let src = e.currentTarget.dataset.src
    let current = src[index]
    wx.previewImage({
      current: current,
      urls: src,
    })
  },

  // 点击收藏
  collection:function(){
    let that = this
    let params = {
      customer : {},
      seek : {}
    }

    let thatData = that.data
    params.customer = thatData.customer
    params.seek.id = Number(thatData.id)
   
    that.savemark(params)
    let collectioned = that.data.collectioned
    // 发起请求，收藏该信息
  },
  // 取消收藏
  collectioned: function () {
    let that = this

    let thatData = that.data
    let params = {
      customerId: thatData.customer.id,
      seekId: Number(thatData.id)
    }
    let collectioned = that.data.collectioned
    wx.showModal({
      title: '确定取消收藏么',
      content: '',
      success:function(res){
        if(res.confirm){
          // 发起请求，收藏该信息
          that.deletmark(params)
          
        }
      }
    })
  },

// 收藏请求
  savemark:function(params){
    let that = this
    request.postRequestWithJSONSchema(['mark/savemark',params]).then(function(res){
   
      if (res.status == 'success'){
        that.setData({
          collectioned: true
        });
        wx.showToast({
          title: '收藏成功',
          duration:2000
        })
      }

    }).catch(function(err){
     
    })
  },

// 取消收藏
  deletmark:function(params){
    let that = this
    request.postRequest(['mark/deletemark',params]).then(function(res){
   
      if (res.status == 'success'){
        that.setData({
          collectioned: false
        });
        wx.showToast({
          title: '已取消收藏',
          duration: 2000
        })
      }

    }).catch(function(err){
     
    })
  },

// 查询收藏

  getmark:function(params){
    let that = this
    request.getRequest(['mark/getmark', params]).then(function (res) {
     
      if (res.status){
        that.setData({
          collectioned: res.status
        })
      }
     
    }).catch(function (err) {
   
    })
  },

  // 点击提供信息
  apply:function(){
    let id = this.data.id
    // app.getUserInfo()
    wx.navigateTo({
      url: '../comment/comment?detailId='+id,
    })
  },

  // 评论外层内容
  coment:function(e){
  
    // app.getUserInfo()
    let id = e.currentTarget.dataset.comentid
    let detailid = this.data.id
   
    wx.navigateTo({
      url: '../comment/comment?repplyId=' + id + '&detailId=' + detailid,
    })
  },
  // 评论内层内容
  reply:function(e){
 
    
    let comentid = e.currentTarget.dataset.comentid
    let id = e.currentTarget.dataset.id
    let detailid = this.data.id

   
    wx.navigateTo({
      url: '../comment/comment?replyId=' + id + '&detailId=' + detailid + '&repplyId=' + comentid,
    })
  },

  // 点击关闭分享弹窗
  closed:function(){
    let that = this
    that.setData({
      markHide:false
    })
  },
  onShareAppMessage:function(res){
    if (res.from == 'button'){
    
    }
    return{
      title: '帮TA寻找回家的路',
    }
  }
})