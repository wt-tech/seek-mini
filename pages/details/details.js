// pages/details/details.js
import util from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:[],
    collectioned:true,
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
    id:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let currentPageNo = that.data.currentPageNo
    let id = options.id
    that.setData({
      id : id
    })
    console.log(options)
    that.loadDetail(id, currentPageNo)
  },

// 加载详情数据
  loadDetail: function (id, currentPageNo){
    let that = this
    let params={
      id : id,
      currentPageNo: currentPageNo
    }
    util.postRequest(['seek/getseek',params]).then(function(res){
      console.log(res)
      let content = res.seekcontent
      
      let coment = []
      for (let topTmp of res.topComents){
        for (let tmp of res.coments){
          if (topTmp.id == tmp.topComentId){
            coment.push(tmp)
            topTmp.coment = coment
          }
        }
      }
      
      for (let Mcoment of res.topComents){
        console.log(Mcoment)
        if (Mcoment.coment){
          Mcoment.coment.sort(function (a, b) {
            return a.comentId - b.comentId
          })
        }
        
      }

      that.setData({
        content: content,
        comment: res.topComents
      })
      console.log(res.topComents)
    }).catch(function(err){
      console.log(err)
    })
  },

// 上拉加载
  onReachBottom:function(){
    console.log('---------------------加载')
  },

  // 图片预览
  previewImg:function(e){
    // console.log(e)
    let current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.content.imgUrls,
    })
  },

  // 点击收藏
  collection:function(){
    let that = this
    let collectioned = that.data.collectioned
    // 发起请求，收藏该信息

    that.setData({
      collectioned: !collectioned
    })
  },
  // 取消收藏
  collectioned: function () {
    let that = this
    let collectioned = that.data.collectioned
    wx.showModal({
      title: '确定取消收藏么',
      content: '',
      success:function(res){
        if(res.confirm){
          // 发起请求，收藏该信息

          that.setData({
            collectioned: !collectioned
          })
        }
      }
    })
  },

  // 点击提供信息
  apply:function(){
    let id = this.data.id
    wx.navigateTo({
      url: '../comment/comment?detailId='+id,
    })
  },

  // 评论外层内容
  coment:function(e){
    let id = e.currentTarget.dataset.id
    console.log('外层id', id)
    wx.navigateTo({
      url: '../comment/comment?replyId=' + id,
    })
  },
  // 评论内层内容
  reply:function(e){
    let id = e.currentTarget.dataset.id
    console.log('内层评论的id',id)
    wx.navigateTo({
      url: '../comment/comment?replyId=' + id,
    })
  }
})