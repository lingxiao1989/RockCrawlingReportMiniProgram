//index.js
//获取应用实例
const app = getApp()
var types = ['default', 'mini']
var pageObject = {
  data: {
    motto: '欢迎使用采购网信息查询系统！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputValue: ""
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //事件处理函数
  startSearching: function () {
    if (this.data.inputValue != null && this.data.inputValue.length > 0) {
      var history = wx.getStorageSync('history') || [];
      history.unshift(this.data.inputValue);
      wx.setStorageSync('history', history);
    };
    wx.navigateTo({
      url: '../results/results?all=' + this.data.inputValue,
      // success: function () {
      //   if (page == undefined || page == null) { return; }
      //   page.onLoad();
      // }
    });
  },
  //输入
  wxSearchInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  //清空
  clearInput: function (e) {
    this.setData({
      inputValue: ""
    });
  }
}

for (var i = 0; i < types.length; ++i) {
  (function (type) {
    pageObject[type] = function (e) {
      var key = type + 'Size'
      var changedData = {}
      changedData[key] =
        this.data[key] === 'default' ? 'mini' : 'default'
      this.setData(changedData)
    }
  })(types[i])
}
Page(pageObject)
