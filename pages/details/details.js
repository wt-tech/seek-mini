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
      // title:'我想寻找走丢的某某',
      // sequence:'A20180506001',
      // missName:'刘某某',
      // gender:'男',
      // birthdate:'2005-06-24',
      // missDate:'2018-05-24',
      // missCityId:'安徽合肥',
      // missDetailPlace:'某某公园附近某某公公某某公园某某公园',
      // feature:'身高，走失时穿着打扮，口音，有没有明显的胎记、痣、身体情况等等',
      // plot:'失踪时的具体情况',
      // seekSubtype:'走失',
      imgUrls: [
        // 'https://www.qghls.com/statics/lawyerv1/views/images/133/1.jpg',
        // 'https://www.qghls.com/statics/lawyerv1/views/images/133/4.jpg',
        // 'https://www.qghls.com/statics/lawyerv1/views/images/133/2.jpg'
      ],
    },
    id:'',
    customer : {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let currentPageNo = that.data.currentPageNo
    let customer = {}
    var customerId = wx.getStorageSync(constant.customerId)
    customer.id = customerId
    let id = options.id
    that.setData({
      customer: customer,
      id : id
    })
    console.log(options, customerId)
    that.loadDetail(id, currentPageNo)

    let params = {
      customerId: customerId,
      seekId : id
    }
    that.getmark(params)
  },

// 加载详情数据
  loadDetail: function (id, currentPageNo){
    let that = this
    let params={
      id : id,
      currentPageNo: currentPageNo
    }
    request.postRequest(['seek/getseek',params]).then(function(res){
      let content = res.seekcontent
      console.log(res)
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
          imgUrls: []
        })
      }

      wx.hideLoading()

      if (res.topComents.length!='0' ){
        let coment = []
        for (let topTmp of res.topComents) {
          for (let tmp of res.coments) {
            if (topTmp.id == tmp.topComentId) {
              coment.push(tmp)
              topTmp.coment = coment
            }
          }
          coment = []
        }

        for (let Mcoment of res.topComents) {
          if (Mcoment.coment) {
            Mcoment.coment.sort(function (a, b) {
              return a.comentId - b.comentId
            })
          }

        }
        let comment = that.data.comment
        // console.log('加载的数据', res.topComents)
        // console.log('重组的数据', coment)
        coment = comment.concat(res.topComents)
        that.setData({
          comment: coment
        })
      } else if (res.topComents.length == '0' && currentPageNo > 1){
        wx.showToast({
          title: '没有更多数据了',
          image:'../../resource/img/tip.png'
        })
      }
      
    }).catch(function(err){
      console.log(err)
    })
  },

  // 预览照片



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
    console.log(e)
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
    console.log(params)
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
      console.log(res)
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
      console.log(err)
    })
  },

// 取消收藏
  deletmark:function(params){
    let that = this
    request.postRequest(['mark/deletemark',params]).then(function(res){
      console.log(res)
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
      console.log(err)
    })
  },

// 查询收藏

  getmark:function(params){
    let that = this
    request.getRequest(['mark/getmark', params]).then(function (res) {
      console.log(res)
      if (res.status){
        that.setData({
          collectioned: res.status
        })
      }
     
    }).catch(function (err) {
      console.log(err)
    })
  },

  // 点击提供信息
  apply:function(){
    let id = this.data.id
    app.getUserInfo()
    wx.navigateTo({
      url: '../comment/comment?detailId='+id,
    })
  },

  // 评论外层内容
  coment:function(e){
    console.log(e)
    app.getUserInfo()
    let id = e.currentTarget.dataset.comentid
    let detailid = this.data.id
    console.log('外层id', id,'内容id',detailid)
    wx.navigateTo({
      url: '../comment/comment?repplyId=' + id + '&detailId=' + detailid,
    })
  },
  // 评论内层内容
  reply:function(e){
    console.log(e)
    let comentid = e.currentTarget.dataset.comentid
    let id = e.currentTarget.dataset.id
    let detailid = this.data.id
    console.log('内层评论的id',id)
    wx.navigateTo({
      url: '../comment/comment?replyId=' + id + '&detailId=' + detailid + '&repplyId=' + comentid,
    })
  }
})