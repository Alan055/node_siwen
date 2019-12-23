const Spider = require("spider.io");



const options = {
  init: {
    debug: false,
    delay: 1000,
    timeout: 5000,
    retrys: 3,
    threads: 1,
    loop: false
  },
  links: {
    title: "",
    hash: "",

    rules: [
      // 列表类型的数据，带下一级处理
      {
        list: "a",
        rule: {
          url: {
            // 同级包含links的，必须有此参数
            type: "href",
            text: ""
          },
          title: {
            type: "text",
            text: ""
          }
        },
        links: []
      },
      // 普通类型的数据
      {
        rule: {
          url: {
            // 同级包含links的，必须有此参数
            type: "href",
            text: ""
          },
          title: {
            type: "text",
            text: ""
          }
        }
      },
      // 数组形式的数据
      {
        key: "",
        list: "",
        rule: {
          url: {
            // 同级包含links的，必须有此参数
            type: "href",
            text: ""
          },
          title: {
            type: "text",
            text: ""
          }
        }
      },
      // 自定义处理返回数据，会合并上一级数据
      {
        cb: ($, init) => {
          // $ -> 为格式化的dom对象，可以直接操作，语法规则请查看 jQuery
          // init -> {hash, data}
          // ...code
          // 如果同级包含links，必须要有返回值，并且要包含url；可以返回 array 或 object
          // return [{url: ''}] or {url: ''};
        }
      }
    ]
  },
  callback: (hash, data) => {
    // 数据以单条记录返回，并不会一次返回所有值
  },
  done: () => {
    // 全部处理完毕后回调该函数
  }
};

new Spider({
  url: "https://trade.500.com/jczq/?playid=270&g=2&date=2019-12-18",
  callback: function(hash, data) {
    console.log(hash, data);
  }
}).run();
