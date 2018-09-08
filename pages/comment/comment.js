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
    repplyId : '',
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
    let repplyId = options.repplyId||''
    // 用户的id
    var getcustomerbyid = wx.getStorageSync(constant.customerId)

    // 设置不同的id
    let seek = that.data.seek;
    let customer = that.data.customer;
    let topComent = that.data.topComent;
    seek.id = Number(detailid);
    customer.id = getcustomerbyid;
    topComent.id = Number(repplyId);
    that.setData({
      repplyId: repplyId,
      seek: seek,
      replyId: replyId,
      customer: customer
    })
    console.log(that.data.seek, customer, getcustomerbyid)

    that.getcustomerbyid(getcustomerbyid)
  },  





  formSubmit:function(e){
    let that = this
    console.log(that.data.repplyId, '*********')
    let thatData = this.data
    let value = {} 
    let concat = {}
    let coment = {}
    let topComent = {}
    concat.realName = e.detail.value.realName;
    concat.tel = e.detail.value.tel;
    concat.customer = {} ;
    concat.customer = thatData.customer;
    coment.id = thatData.replyId;

    value.content = e.detail.value.content;
    // value.seekId = thatData.seek.seekId
    value.seek = that.data.seek
    value.customer = {}
    value.customer = thatData.customer;
    value.topComent = thatData.topComent

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
      if (!that.data.replyId && !that.data.repplyId){
        // 评论寻人信息
        that.savetopcoment(value)
       
      } else if (that.data.replyId) {
        // 内层层评论
        value.topComent = that.data.topComent
        value.coment = coment
        that.savecoment(value)
      }else {
        //外层的评论
        value.topComent = that.data.topComent
        that.savecoment(value)
      }


    }
  },

  savetopcoment:function(params){
    let that = this
    request.postRequestWithJSONSchema(['topcoment/savetopcoment',params]).then(function(res){
      console.log(res)
      if (res.status == 'success'){
        wx.showToast({
          title: '提交成功',
        })
        that.setData({
          realName: '',
          content: '',
          tel: ''
        })

      }
    }).catch(function(err){
      console.log(err)
    })
  },

  savecoment:function(params){
    let that = this
    request.postRequestWithJSONSchema(['coment/savecoment', params]).then(function(res){
      console.log(res)
      if (res.status == 'success') {
        wx.showToast({
          title: '提交成功',
        })
        that.setData({
          realName: '',
          content: '',
          tel: ''
        })

      }
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