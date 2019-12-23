const CrawlNeko = require('crawl-neko');
const Path = require('path');

let catalog = new CrawlNeko();
let detail = new CrawlNeko();

catalog.on('data', $ => {
  return $('body').html();
});

// And out put them
catalog.on('final', href => {
  console.log(href);
});

detail.on('data',($,url)=>{
  console.log("111")
  console.log($,url)
})

// And output and download them (CAUTION: Adult content)
detail.on('final', result => {
  console.log("\ngid: " + result.gid + "\n" + result.tittle1 + "\n" + result.tittle2 + "\nPages: " + result.pages + "\niid: " + result.iid);

  let downloads = [];

  for (let i = 1; i <= result.pages; i++) {
    downloads.push({
      type: 'download',
      dir: 'dltest' + Path.sep + result.gid,
      file: i + ".jpg",
      url: 'https://i.nhentai.net/galleries/' + result.iid + '/' + i + '.jpg',
      callback: (opt) => {
        console.log("Download " + opt.url + " success!");
      }
    });
  }

  return downloads;
});
catalog.start('https://trade.500.com/jczq/?playid=270&g=2&date=2019-12-18')
  .then(res=>{
    console.log(res)
  });
