const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function http(url, callBack) {
  console.log(url);
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error);
      wx.showModal({
        title: '错误',
        content: '未获得服务器响应,请重试',
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
  })
} 
function convertTimeFormat(result) {
  var newFormat1 = new Date(parseInt(result.releaseTime) ).toLocaleString().replace(/:\d{1,2}$/, ' ');
  result.releaseTime = newFormat1.split(" ")[0];
  var newFormat2 = new Date(parseInt(result.expiryTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
  result.expiryTime = newFormat2.split(" ")[0];
}
function convertContentFormat(result){
  // console.log(result.content.replace(/<[\d\w=\/"%]+>/g, ""));
  result.content = result.content.replace(/<[\d\w=\/"%]+>/g, "").replace(/\n{3,}/g,"\n\n");
}
function convertToTitleArray(result,keyword) {
  var titleArray={};
  if (keyword!=""){
    var index = result.title.indexOf(keyword);
    if (index == -1) {
      titleArray.keywordsInTitle = false;
      titleArray.fullPart = result.title;
      result.title = titleArray;
      // return result;
    }
    else{
      titleArray.keywordsInTitle = true;
      titleArray.partOne = result.title.substr(0, index);
      titleArray.partTwo = keyword;
      titleArray.partThree = result.title.substr(index + keyword.length);
      titleArray.fullPart = result.title;
      result.title = titleArray;
      // return result;
    }
  }
  else {
    titleArray.keywordsInTitle = false;
    titleArray.fullPart = result.title;
    result.title = titleArray;
    // return result;
  }
}


module.exports = {
  http: http,
  convertTimeFormat: convertTimeFormat,
  convertContentFormat: convertContentFormat,
  convertToTitleArray: convertToTitleArray,
  formatTime: formatTime,

}