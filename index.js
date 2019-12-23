/*
	骚文爬虫
	从页面中爬出想要的数据  然后做成表格
	这生成表格
*/
const fs = require("fs")
const cheerio = require('cheerio')
let nodeExcel = require('excel-export')
const puppeteer = require('puppeteer'); // 爬虫插件  这个要在电脑上运营一个浏览器的插件 运行完成会关闭浏览器
const xlsx = require('node-xlsx')

let scrape = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.goto('http://live.500.com/');

	const result = await page.evaluate(() => {
		let data = []; // 初始化空数组来存储数据
		let body = document.body.innerHTML

		return body; // 返回数据
	});

	browser.close();
	return result;
};

scrape().then((dom) => {
	// fs.writeFileSync('./index.html',dom) // 将html存起来
	let $ = cheerio.load(dom);
	let select = $('.bf_tablelist01 #sel_odds option') // 下拉选择器
	let selectList = Array.from(select).map(val=>({label:$(val).text(),value:$(val).attr('value')}))
	// console.log(selectList) // 拿到下拉选择器的数据

	// 然后去获取表格的数据
	// 先拿页头的数据
	let top = $('.bf_tablelist01 thead tr td') // 页头的选择器
	let topList = Array.from(top).map(e=>($(e).text().trim().replace(/\s+/g,' ').split(' ')))
	topList = topList.splice(0,topList.length-3).flat() // 拿到表格头部的数据
	// console.log(topList)

	// 去拿PL 使用正则
	let liveOddsList = JSON.parse(dom.match(/liveOddsList = (\S*);/)[1]) // 拿到PL
	// console.log(liveOddsList)

	// 去拿表格的数据
	let tableList = []
	let tableConten = $('.bf_tablelist01 tbody tr')
	for(let val of Array.from(tableConten)){
		let obj = {
			date: $($(val).find('td')[0]).text(), // 场次
			address: $($(val).find('td')[1]).text(), // 赛事
			Rounds: $($(val).find('td')[2]).text(), // 轮次
			times: $($(val).find('td')[3]).text(), // 时间
			status: $($(val).find('td')[4]).text(), // 状态
			home: $($($(val).find('td')[5])).find('a').text(), // 主队
			score: $($(val).find('td')[6]).text(), // 比分
			away: $($(val).find('td')[7]).text(), // 客队
			Halftime: $($(val).find('td')[8]).text(), // 半场

		}
		let fid = $(val).attr('fid')
		let currentObj = liveOddsList[fid] // 拿到当前的pl组
		Object.assign(obj,currentObj)
		tableList.push(obj)
	}
	// console.log(tableList) // 拿到了表格的数据


	// 写入到表格里面
	const conf = {};
	conf.stylesXmlFile = "styles.xml"
// 定义sheet名称
	conf.name = "爬虫数据";
// 定义列的名称以及数据类型
	conf.cols = topList.map(e=>({caption:e, type:'string'}))
	for(let [i, v] of conf.cols.entries()){
		if(i>8){
			conf.cols.splice(i, 1,[ v,{ caption: ' ', type: 'string' }, { caption: ' ', type: 'string' }])
		}
	}
	conf.cols = conf.cols.flat()
// 定义row的数据
	conf.rows = [];
	for(let val of tableList){
		conf.rows.push()
		let arr = [
			val.date,
			val.address,
			val.Rounds,
			val.times,
			val.status,
			val.home,
			val.score,
			val.away,
			val.Halftime,
		]
		for (let [i, m] of topList.entries()) {
			if(i>8){
				let str = selectList.filter(e=>(e.label == m))
				let a = val[str[0].value]
				arr.push(a||['-','-','-'])
			}
		}
		conf.rows.push(arr.flat())
	}
	console.log(conf.cols)

	let dataSheet1 = [conf.cols.map(e=>(e.caption))].concat(conf.rows)
	let range1 = {s: {c: 9, r:0 }, e: {c:11, r:0}}
	let range2 = {s: {c: 12, r:0 }, e: {c:14, r:0}}
	let range3 = {s: {c: 15, r:0 }, e: {c:17, r:0}}
	let range4 = {s: {c: 18, r:0 }, e: {c:20, r:0}}
	let range5 = {s: {c: 21, r:0 }, e: {c:23, r:0}}
	let range6 = {s: {c: 24, r:0 }, e: {c:26, r:0}}
	let range7 = {s: {c: 27, r:0 }, e: {c:29, r:0}}
	let sheetOptions = {'!merges': [ range1, range2,range3,range4,range5,range6,range7]}
	var result = xlsx.build([{name: "秘籍", data: dataSheet1,  options: sheetOptions}]); // 转成二进制
	let targetPath = './秘籍.xlsx'
	// fs将文件写到内存
	fs.writeFile(targetPath, result, 'binary',function(err) {
		if (err) {
			console.log(err);
		}
		console.log("success!");
	});
// 剪切文件  是通过二进制流的形式传输  所以管道两端需要有"水桶"(文件)去接收
// 	let newFile = fs.createWriteStream('秘籍.xlsx') // 先创建一个文件 作为接收文件的容器
// 	let targetFile = fs.createReadStream(targetPath) // 然后读取 需要转移的文件
// 	targetFile.pipe(newFile)// 复制目标文件的二进制流  通过管道流入 新文件中  即形成了复制功能
// 	targetFile.on('close', function () { // 监听是否传输完成 这里是监听的目标文件关闭的时候
// 		console.log("完成了")
// 		// fs.unlinkSync(targetPath) // 最后删除文件
// 	})
});
