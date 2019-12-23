const spiderNode = require('spider-node').default

let config = {
  name: 'spider', // 名称
  log: true,// 是否打印日志
  http: {
    maxConnect: 1, // 规则默认的最大连接 如果规则本身没有制定则会继承此设置(如果为1,则会等待上一个任务结束后再次发送任务)
    delay: 1, // 每次请求后的等待时间
    charset: 'utf-8', // 编码方式 如果是html文本 将用于解析默认为: utf-8
    meta: {},
    // requestConfig // requets配置
  },
  rules: [
    {
      name: 'ruleName', // 规则名称
      test: /regExp/,
      config: { // rule 配置
        include: true, // 是否从url中按照规则匹配url (true)
        // baseUrl: '', // 从文件自动匹配url时,将会默认根据父级url进行拼接,如果提供此值,将使用它进行解析url
        // maxConnect: number, // 最大连接数（如果没有设置则继承http中的最大连接数
        // delay: number, // 单个规则的等待时间（如果没有设置则继承http中的delay
        // http: HttpConfig, // 单独配置网络配置,同上
        // meta: { // 可携带自定义信息 可在处理函数中修改
        // }
      },
      async parse(url, data, selector, config, spider) {
        url // url
        data // 数据
        selector // cheerio解析器
        config // 该url的配置,可以取出meta response可以查看原始返回数据
        spider // 爬虫实例,可以调用push进行添加请求(可通过 spider.push(url,{meta:{}}))的方式传递信息
      },
      async pipeline(item) {
        // parse的返回值将进入
        console.log(item)
      },
      error(url, error, config, spider) {
        // 错误后调用
      }
    }
  ],
  async open() {
    // 启动时调用
  }
  ,
  async close() {
    // 结束时调用
    console.log(123)
  }
  ,
  downloadMiddleware: [
    async (config) => {
      // 下载中间件
      // return false 中断请求
      // return config 可改变config
    }
  ],
  errorMiddware:
    [
      (
        url, error, config, spider
      ) => {
        // 下载失败中间件
      }
    ]
}

// const spider = new spiderNode(config) // config请参照下方,具体使用方式可以参照test中的测试用例
// spider.start('https://trade.500.com/jczq/?playid=270&g=2&date=2019-12-18')


const spider = new spiderNode({
  http: ''
})
spider.push('https://trade.500.com/jczq/?playid=270&g=2&date=2019-12-18').then(function (res) {
  console.log(res)
})
