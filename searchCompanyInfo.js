//searchCompanyInfo.js
//获取应用实例
var app = getApp()
//数据库引用
var db = require('../../utils/db_common.js')

Page({
  data: {
    //-----固定代码-----START
    DOMAIN: app.globalData.DOMAIN,
    //-----固定代码-----END
    //分类picker数据
    kindArray: [],
    rateArray: [],
    kindIdx: 0,
    rateIdx: 0
  },
  onLoad: function () {
    var that = this
    var objparam
    
    if (app.globalData.codemstKind.length == 0){
        //取得分类选择数据
        objparam = { KIND: "001" }
        db.db_get('getcodemst.php', dbsuccess, this.data.DOMAIN,objparam)
        //local数据取得成功时的回调函数
        function dbsuccess(res) {
          console.log('取得分类选择数据 load dbsuccess')
          //console.log(res.data)
          that.setData({
            kindArray: res.data
        })
        app.globalData.codemstKind = res.data
      }
    }else{
      that.setData({
        kindArray: app.globalData.codemstKind,
        kindIdx:   app.globalData.kindIdx
      })
    }

    if (app.globalData.codemstRate.length == 0) {
      //取得Rate选择数据
      objparam = { KIND: "002" }
      db.db_get('getcodemst.php', dbsuccess, this.data.DOMAIN, objparam)
      //local数据取得成功时的回调函数
      function dbsuccess(res) {
        console.log('取得Rate选择数据 load dbsuccess')
        //console.log(res.data)
        that.setData({
          rateArray: res.data
        })
        app.globalData.codemstRate = res.data
      }
    } else {
      that.setData({
        rateArray: app.globalData.codemstRate,
        rateIdx: app.globalData.rateIdx
      })
    }
  },
  //种类Picker值改变时
  KindChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      kindIdx: e.detail.value
    })
    var data = this.data
    console.log('picker发送选择改变，携带值为', data.kindArray[data.kindIdx].CODE + data.kindArray[data.kindIdx].CODE_CON_CN) 
    app.globalData.kindIdx = this.data.kindIdx 
  },
  //工资Picker值改变时
  rateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      rateIdx: e.detail.value
    })
    var data = this.data
    console.log('picker发送选择改变，携带值为', data.rateArray[data.rateIdx].CODE + (data.rateArray[data.rateIdx].CODE_CON_CN).substring(1))
    app.globalData.rateIdx = this.data.rateIdx 
  },
  //寻找工人按钮事件
  searchworker: function (e) {
    console.log('寻找工人按钮事件')
    var that = this
    var data = this.data
    var conRange = ""
    var conPrice = ""
    if (data.kindIdx != 0){
      conRange = data.kindArray[data.kindIdx].CODE_CON_CN
    }
    if (data.rateIdx != 0) {
      conPrice = (data.rateArray[data.rateIdx].CODE_CON_CN).substring(1)
    }
    //按条件选择数据
    var objparam = {
      RANGE: conRange,
      PRICE: conPrice}
    //取得数据
    db.db_get('getcompanyinfo.php', dbsuccess, that.data.DOMAIN,objparam)

    //local数据取得成功时的回调函数
    function dbsuccess(res) {
      console.log('dbsuccess')
      app.globalData.indexResults = res.data;
      // 返回首页面
      wx.navigateBack({
        delta: 1
      })
    }

  }
})
