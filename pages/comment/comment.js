// pages/comment/comment.js
import request from '../../utils/request.js';
import constant from '../../utils/constant.js';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName:'',
    content:'',
    tel:'',
    customer:{},
    seek : {},
    topComent : {},
    getcustomerbyid : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 详情的id
    let detailid = options.detailId || ''
    // 上级评论的id
    let replyId = options.replyId || ''
    let repplyId = options.replyId||''
    // 用户的id
    var getcustomerbyid = wx.getStorageSync(constant.customerId)

    // 设置不同的id
    let seek = that.data.seek;
    let customer = that.data.customer;
    let topComent = that.data.topComent;
    seek.id = Number(detailid);
    customer.id = getcustomerbyid;
    topComent.id = Number(replyId);
    that.setData({
      seek: seek,
      replyId: replyId,
      customer: customer
    })
    console.log(that.data.seek, customer, getcustomerbyid)

    that.getcustomerbyid(getcustomerbyid)
  },  





  formSubmit:function(e){
    let that = this
    let thatData = this.data
    let value = {} 
    let concat = {}
    let topComent = {}
    concat.realName = e.detail.value.realName;
    concat.tel = e.detail.value.tel;
    concat.customer = {} ;
    concat.customer = thatData.customer;

    value.content = e.detail.value.content;
    // value.seekId = thatData.seek.seekId
    value.seek = that.data.seek
    value.customer = {}
    value.customer = thatData.customer;
    if (thatData.replyId){
      value.topComent = thatData.topComent
    }
    console.log(value)
    if (value.content == ''){
      wx.showToast({
        title: '线索不能为空',
        image:'../../resource/img/error.png'
      })
    }else if(value.realName == ''){
      wx.showToast({
        title: '请填写姓名',
        image: '../../resource/img/error.png'
      })
    }else if(value.tel == ''){
      wx.showToast({
        title: '请填写联系方式',
        image: '../../resource/img/error.png'
      })
    }else {
      // 发起请求
      console.log(concat,value)
      if (that.data.seek){
        that.savetopcoment(value)
       
      }else{
        that.savecoment(value)
      }


    }
  },

  savetopcoment:function(params){
    request.postRequestWithJSONSchema(['topcoment/savetopcoment',params]).then(function(res){
      console.log(res)
      if (res.status == 'success'){

      }
    }).catch(function(err){
      console.log(err)
    })
  },

  savecoment:function(params){
    request.postRequestWithJSONSchema(['coment/savecoment', params]).then(function(res){
      console.log(res)
    }).catch(function(err){
      console.log(err)
    })
  },
  getcustomerbyid:function(id){
    let that = this
    request.getRequest(['getcustomerbyid',{id : id}]).then(function(res){
      console.log(res)
      that.setData({
        realname: res.realname,
        tel: res.tel
      })
    }).catch(function(err){
      console.log(err)
    })
  }


})