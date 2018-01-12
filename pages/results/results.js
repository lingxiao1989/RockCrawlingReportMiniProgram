const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // arrayData: null,
    // dialogData: null,

    radio: [
      { index: 0, name: '全部', checked: true },
      { index: 1, name: '征求意见函', checked: false },
      { index: 2, name: '采购信息', checked: false },
      { index: 3, name: '中标结果', checked: false }
    ],

    source: "",
    category: 0,
    field: "",
    requestUrl: "",
    inputValue: "",
    showSearchPanel: false,
    showFilterPanel: false,
    bottomLayerDisabled: false,
    gotop:false,
    scrollable: true,
    currentKeyword: "",
    totalCount: 0,
    currentPage: 1,
    hiddenLoading: false,
    results: {},
    resultEmpty: true,
    atBottomReminder: false,
    history: [],
    filters: [],
    currentFilterName:"自定义条件",
    currentFilter: {
      index: "",
      filterName: "",
      sourceIndex: 0,
      timeRangeIndex: 0,
      priceLowerBound: "",
      priceUpperBound: "",
      tagName: ""
    },
    scrollViewHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var scrollViewHeight=0;
    wx.getSystemInfo({
      success: function (res) {
        scrollViewHeight=res.windowHeight - res.windowWidth / 750 * 250
      }
    })
    this.setData({
      inputValue: query.all,
      currentKeyword: query.all,
      history: (wx.getStorageSync('history') || []).map(history => {
        return history
      }),
      filters: (wx.getStorageSync('filters') || []).map(filters => {
        return filters
      }),
      category: 0,
      showSearchPanel: false,
      showFilterPanel: false,
      bottomLayerDisabled: false,
      scrollable: true,
      atBottomReminder: false,
      currentFilterName: "自定义条件",
      scrollViewHeight: scrollViewHeight,
      gotop: false
    });
    if (query.useFilterName != undefined && query.useFilterIndex != undefined){
      var filters = this.data.filters;
      for (var index in filters) {
        if (filters[index].index == query.useFilterIndex) {
          this.setData({
            currentFilter: filters[index],
            currentFilterName: filters[index].filterName,

          });
          break;
        }
      }
    }
    // console.log(this.data);
    this.data.requestUrl = app.globalData.bidingInfoApi + "?";
    var requestUrl = this.data.requestUrl + "&type=" + this.data.category + "&all=" + this.data.currentKeyword + "&page=" + this.data.currentPage + "&time=" + this.data.currentFilter.timeRangeIndex + "&lowerBound=" + this.data.currentFilter.priceLowerBound + "&upperBound=" + this.data.currentFilter.priceUpperBound + "&category=" + this.data.currentFilter.tagName;
    util.http(requestUrl, this.processObtainedData);

  },

  //处理后台的返回结果
  processObtainedData: function (ObtainedData) {
    app.globalData.targetItemDetail = {};
    // console.log(ObtainedData);
    var result = [];
    var _this = this;
    //没有更多啦
    if (ObtainedData.rows == null) {
      wx.showModal({
        title: '错误',
        content: '返回数据错误,请重试',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.onLoad();
            wx.navigateBack();
          }
        }
      });
    }
    else if (ObtainedData.rows.length <= 0) {
      if (!_this.data.atBottomReminder) {
        _this.setData({
          atBottomReminder: false
        });
        setTimeout(function () {
          _this.setData({
            atBottomReminder: true
          });
        }, 100);
      }
    }
    for (var index in ObtainedData.rows) {
      util.convertTimeFormat(ObtainedData.rows[index]);
      util.convertContentFormat(ObtainedData.rows[index]);
      util.convertToTitleArray(ObtainedData.rows[index], _this.data.inputValue);
      result.push(ObtainedData.rows[index]);
    }
    var totalResults = {}
    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.resultEmpty) {
      totalResults = this.data.results.concat(result);
    }
    else {
      totalResults = result;
      this.data.resultEmpty = false;
    }
    this.setData({
      results: totalResults
    });
    this.data.totalCount += 10;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
    this.setData({
      hiddenLoading: true
    })
  },

  //聚焦
  wxSearchFocus: function (e) {

    this.setData({
      showSearchPanel: true,
      showFilterPanel: false,
      scrollable: false,
      bottomLayerDisabled:true
    })
  },
  //输入
  wxSearchInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //清空
  clearInput: function (e) {
    this.setData({
      inputValue: ""
    });
    this.startSearching();
  },
  //点击历史记录
  tapSearchHistory: function (e) {
    this.setData({
      inputValue: e.target.dataset.row
    });
    this.startSearching();
  },
  //清空历史记录
  clearSearchHistory: function (e) {
    wx.removeStorageSync('history');
    this.setData({
      history: []
    });
  },

  //搜索
  startSearching: function (event) {
    var currentKeyword = this.data.inputValue;
    this.setData({
      results: {},
      resultEmpty: true,
      totalCount: 0,
      currentPage: 1,
      atBottomReminder: false,
      showSearchPanel: false,
      showFilterPanel: false,
      bottomLayerDisabled: false,
      scrollable: true,
      currentKeyword: currentKeyword,
      hiddenLoading: false,
      gotop:true
    });
    if (currentKeyword != null && currentKeyword.length > 0) {
      var history = wx.getStorageSync('history') || [];
      history.unshift(currentKeyword);
      wx.setStorageSync('history', history);
    };
    // console.log(this.data);
    var requestUrl = this.data.requestUrl + "&type=" + this.data.category + "&all=" + this.data.currentKeyword + "&page=" + this.data.currentPage + "&time=" + this.data.currentFilter.timeRangeIndex + "&lowerBound=" + this.data.currentFilter.priceLowerBound + "&upperBound=" + this.data.currentFilter.priceUpperBound + "&category=" + this.data.currentFilter.tagName;
    util.http(requestUrl, this.processObtainedData);
  },
  //焦点离开
  wxSearchBlur: function (event) {
    this.setData({
      showSearchPanel: false,
      showFilterPanel: false,
      bottomLayerDisabled: false,
      scrollable: true,
    });
  },

  tapRadio:function(event){
    var category;
    var radio=this.data.radio;
    for (var index in radio) {
      if (radio[index].index==event.currentTarget.id) {
        radio[index].checked=true;
      }
      else { radio[index].checked = false;
        }
    };
    switch (event.currentTarget.id) {
      case "0":
        category = 0;
        break;
      case "1":
        category = 3;
        break;
      case "2":
        category = 1;
        break;
      case "3":
        category = 2;
        break;
    };
    this.setData({
      category: category,
      radio: radio
    }); 
    this.startSearching();
  },

  tapChooseFilter:function(){
    console.log(this.data)
    this.setData({
      showSearchPanel: false,
      showFilterPanel: true,
      scrollable: false,
      bottomLayerDisabled: true,
    });
  },
  tapCustomFilter:function(event){
    this.setData({
      showFilterPanel: false,
      scrollable: true,
      bottomLayerDisabled: false,
      currentFilter: event.currentTarget.dataset.row,
      currentFilterName: event.currentTarget.dataset.row.filterName,
    });
    //console.log(this.data);
  },
  tapFilterSetting: function (event) {
    wx.navigateTo({
      url: '../settings/settings?createNewFilter=false&all=' + this.data.inputValue+'&index=' + event.currentTarget.dataset.row,
      success: function () {
        // if (page == undefined || page == null) { return; }
        // page.onLoad();
      }
    });
  },
  tapNoFilter: function () {
    var currentFilter= {
      index: "",
      filterName: "",
      sourceIndex: 0,
      timeRangeIndex: 0,
      priceLowerBound: "",
      priceUpperBound: "",
      tagName: ""
    };
    this.setData({
      showFilterPanel: false,
      scrollable: true,
      bottomLayerDisabled: false,
      currentFilter: currentFilter,
      currentFilterName: "自定义条件",
    });
  },
  tapAddFilter: function () {
    wx.navigateTo({
      url: '../settings/settings?createNewFilter=true&all=' + this.data.inputValue
    });
  },

  //使用url传值存在 ?,=,&等符号无法传递的问题，使用JSON.stringify().replace(/\?/g, '~1').replace(/=/g, '~2').replace(/&/g, '~3')的方法替换掉可能存在其他符号问题，所以使用全局变量传值!
  onItemTap: function (event) {
    app.globalData.targetItemDetail = event.currentTarget.dataset.row;
    wx.navigateTo({
      url: "result-details/result-details"
    })
  },

  /**
   * 显示、关闭弹窗
   */

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    app.globalData.targetItemDetail = {};
    // wx.setNavigationBarTitle({
    //   title: this.data.category
    // })
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
  // onPullDownRefresh: function () {
  //   app.globalData.targetItemDetail = {};
  //   this.setData({
  //     results: {},
  //     resultEmpty: true,
  //     totalCount: 0,
  //     currentPage: 1,
  //     atBottomReminder: false,
  //   });
  //   util.http(this.data.requestUrl + "&all=" + this.data.currentKeyword + "&page=" + this.data.currentPage, this.processObtainedData);
  //   wx.showNavigationBarLoading();
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 上滑加载
    app.globalData.targetItemDetail = {};
    this.data.currentPage++;
    // this.data.hiddenLoading=false;
    var requestUrl = this.data.requestUrl + "&type=" + this.data.category + "&all=" + this.data.currentKeyword + "&page=" + this.data.currentPage + "&time=" + this.data.currentFilter.timeRangeIndex + "&lowerBound=" + this.data.currentFilter.priceLowerBound + "&upperBound=" + this.data.currentFilter.priceUpperBound + "&category=" + this.data.currentFilter.tagName;
    util.http(requestUrl, this.processObtainedData);
    wx.showNavigationBarLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

