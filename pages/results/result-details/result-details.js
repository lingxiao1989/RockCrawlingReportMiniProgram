// pages/results/result-details/result-details.js
const app = getApp();
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemDetail:{},
    copyUrlClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemDetail:app.globalData.targetItemDetail
    });

    //let data = JSON.parse(options.data);
    //var row = eval(options.data.data);

  },
  tapCopyUrl:function(event){
    
    this.setData({
      copyUrlClicked:true
    });
    console.log(this.data);
    wx.setClipboardData({
      data: event.target.dataset.url,
      success() {
        wx.showToast({
          title: '已复制至剪贴板',
          icon: 'succes',
          duration: 1500,
          mask: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})