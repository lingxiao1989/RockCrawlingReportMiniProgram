//logs.js
const util = require('../../utils/util.js');
const app=getApp();

var pageObject = {
  data: {
    keywords:"",
    filters: [],
    currentFilter: {
      index:"", 
      filterName:"",
      sourceIndex:0,
      timeRangeIndex:0,
      priceLowerBound: "",
      priceUpperBound: "",
      tagName: "类型不限"
    },
    currentFilterPosition:"",
    createNewFilter:true,
    sourceArray: [
      { index: '0', name: '来源不限', checked: true },
      { index: '1', name: '天津市政府采购网', checked: false }
    ],
    showSource: false,
    timeRangeArray: [
      { index: '0', name: '范围不限', checked: true  },
      { index: '1', name: '一月内', checked: false  },
      { index: '2', name: '半年内', checked: false  },
      { index: '3', name: '一年内', checked: false  },
      { index: '4', name: '三年内', checked: false  },
    ],
    showTimeRange: false,
    tagArray: [
      { index: 0, name: '类型不限', checked: true },
      { index: 1, name: '机械加工', checked: false },
      { index: 2, name: '水利行业', checked: false },
      { index: 3, name: '景观绿化', checked: false },
      { index: 4, name: '能源环保', checked: false },
      { index: 5, name: '医疗器械', checked: false },
      { index: 6, name: '人事服务', checked: false },
      { index: 7, name: '通用机械', checked: false },
      { index: 8, name: '电力行业', checked: false },
      { index: 9, name: '石油化工', checked: false },
      { index: 10, name: '仪器仪表', checked: false },
      { index: 11, name: '建材楼宇', checked: false },
      { index: 12, name: '建筑材料', checked: false },
      { index: 13, name: '通信工程', checked: false },
      { index: 14, name: '纺织机械', checked: false },
      { index: 15, name: '空气分离', checked: false },
      { index: 16, name: '物流运输', checked: false },
      { index: 17, name: '安防工程', checked: false },
      { index: 18, name: '警用装备', checked: false },
      { index: 19, name: '印刷包装', checked: false },
      { index: 20, name: '食品加工', checked: false },
      { index: 21, name: '电子信息', checked: false },
      { index: 22, name: '办公设备', checked: false },
      { index: 23, name: '其他设备', checked: false },
      { index: 24, name: '交通运输', checked: false },
      { index: 25, name: '建筑工程', checked: false },
      { index: 26, name: '其他', checked: false },
    ],
    showTag:false
  },
  onLoad: function (query) {
    // console.log(query);
    var _this = this;
    if(query.createNewFilter=="false"){
      _this.setData({
        keywords:query.all,
        createNewFilter: false,
        filters: (wx.getStorageSync('filters') || []).map(filters => {
          return filters
        }),
      });
    }else{
      _this.setData({
        keywords: query.all,
        createNewFilter: true,
        filters: (wx.getStorageSync('filters') || []).map(filters => {
          return filters
        }),
      });
    }
    var filters = _this.data.filters;
    if (_this.data.createNewFilter){
      if (filters.length!=0){
        // console.log(filters[filters.length - 1].index + 1);
        var newIndex = filters[filters.length - 1].index+1;
        var currentFilter={
          index: newIndex,
          filterName: "条件" + newIndex,
          sourceIndex: 0,
          timeRangeIndex: 0,
          priceLowerBound: "",
          priceUpperBound: "",
          tagName: "类型不限"
        };
        _this.setData({
          currentFilter: currentFilter
        });
      }
      else{
        var currentFilter = {
          index: 1,
          filterName: "条件1",
          sourceIndex: 0,
          timeRangeIndex: 0,
          priceLowerBound: "",
          priceUpperBound: "",
          tagName: "类型不限"
        };
        _this.setData({
          currentFilter: currentFilter
        });
      }
    }
    else{
      for (var index in filters) {
        if (filters[index].index == query.index) {
          _this.setData({
            currentFilter: filters[index],
            currentFilterPosition:index
          });
          break;
        }
      }
    }
    // console.log(this.data);
  },

  onReady: function () {

  },

  bindFilterNameInput:function(event) {
    var currentFilter = this.data.currentFilter;
    currentFilter.filterName = event.detail.value;
    this.setData({
      currentFilter: currentFilter
    })
  },
  //点击选择来源
  tapSource: function () {
    var showSource = this.data.showSource;
    this.setData({
      showSource: !showSource
    });
  },
  //选中来源
  radioChangeSource: function (event) {
    var sourceArray = this.data.sourceArray;
    var currentFilter = this.data.currentFilter;
    for (var i = 0, len = sourceArray.length; i < len; ++i) {
      sourceArray[i].checked = sourceArray[i].index == event.detail.value
    }
    currentFilter.sourceIndex = event.detail.value;
    this.setData({
      sourceArray: sourceArray,
      currentFilter: currentFilter,
      showSource: false
    });
    // console.log(this.data.currentFilter);
  },
  //点击选择时间
  tapTimeRange: function () {
    var showTimeRange = this.data.showTimeRange;
    this.setData({
      showTimeRange: !showTimeRange
    });
  },
  //选中时间
  radioChangeTimeRange: function (event) {
    var timeRangeArray = this.data.timeRangeArray;
    var currentFilter = this.data.currentFilter;
    for (var i = 0, len = timeRangeArray.length; i < len; ++i) {
      timeRangeArray[i].checked = timeRangeArray[i].index == event.detail.value
    }
    currentFilter.timeRangeIndex = event.detail.value;
    this.setData({
      timeRangeArray: timeRangeArray,
      currentFilter: currentFilter,
      showTimeRange: false
    });
  },
  //设定金额下限
  bindLowerBoundInput: function (event) {
    var currentFilter = this.data.currentFilter;
    currentFilter.priceLowerBound = event.detail.value;
    this.setData({
      currentFilter: currentFilter
    })
  },
  //设定金额上限
  bindUpperBoundInput: function (event) {
    var currentFilter = this.data.currentFilter;
    currentFilter.priceUpperBound = event.detail.value;
    this.setData({
      currentFilter: currentFilter
    })
  },
  //点击选择标签
  tapTag: function () {
    var showTag = this.data.showTag;
    this.setData({
      showTag: !showTag
    });
    // console.log(this.data);
  },
  //选中标签
  radioChangeTag: function(event){
    var tagArray = this.data.tagArray;
    var currentFilter = this.data.currentFilter;
    for (var i = 0, len = tagArray.length; i < len; ++i) {
      tagArray[i].checked = tagArray[i].tagName == event.detail.value
    }
    currentFilter.tagName = event.detail.value;
    this.setData({
      tagArray: tagArray,
      currentFilter: currentFilter,
      showTag: false
    });
  },
  //点击保存并使用
  bindConfirmTap: function () {
    var filters = this.data.filters;
    if (this.data.createNewFilter) {
      filters.push(this.data.currentFilter);
      wx.setStorageSync('filters', filters);
    }
    else {
      filters[this.data.currentFilterPosition] = this.data.currentFilter;
      wx.setStorageSync('filters', filters);
    }
    // console.log(filters);
    wx.redirectTo({
      url: '../results/results?all=' + this.data.keywords + '&useFilterName=' + this.data.currentFilter.filterName + '&useFilterIndex=' + this.data.currentFilter.index,
      success: function () {
        // if (page == undefined || page == null) { return; }
        // page.onLoad();
      }
    });
  },
  //点击删除该条件
  bindDeleteTap: function (e) {
    var filters = this.data.filters;
    if (!this.data.createNewFilter) {
      filters.splice(this.data.currentFilterPosition, 1);
      wx.setStorageSync('filters', filters);
    }
    // console.log(filters);
    wx.redirectTo({
      url: '../results/results?all=' + this.data.keywords
    });
  },
}


Page(pageObject)