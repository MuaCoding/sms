export let siderMenus = [
  {
    title: "数据统计",
    children: [{
      text: "数据看板",
      name: "record-board",
      icon: "md-cube",
      link: "recordBoard",
      active: "recordBoard"
    }, {
      text: "数据查询",
      name: "record-query",
      icon: "ios-analytics",
      link: "recordQuery",
      active: "recordQuery"
    }, {
      text: "营销查询",
      name: "marketing-query",
      icon: "ios-construct",
      link: "marketingQuery",
      active: "marketingQuery"
    }, {
      text: "发送平台",
      name: "sending-platform",
      icon: "ios-paper-plane",
      link: "sendingPlatform",
      active: "sendingPlatform"
    }, {
      text: "回执查询",
      name: "receipt-query",
      icon: "ios-infinite",
      link: "receiptQuery",
      active: "receiptQuery"
    }]
  }
]
