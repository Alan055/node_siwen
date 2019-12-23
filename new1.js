'use strict';
const url = require('url');
const downtune = require('downtune.js');
const fs = require('fs');

const host = 'https://trade.500.com/';

const coolapk = {
  log_level: 'debug', // log_level:
  concurrency: 1, // concurrency control
  retry : 1, // max retry times for failed request
  timeout : 10, // request timeout use seconds
  entry: {    // entry config
    reqOpt : 'https://trade.500.com/jczq/?playid=270&g=2&date=2019-12-18', // request options like url, headers, method\(GET or POST\), proxy and etc...
    link : $ => ({  // crawler will extract urls from webpage by 'link' property and add these urls to crawler urls queue, $ is a cheerio instance
      list :  $('body')
    })
  },
  list : {
    link : $ => ({
      app : console.log($('body'))
    }),
  },
  app : {
    link : $ => ({
      apk : $('body')
    })
  },
  apk : {
    item : async $ => { // crawler will deal with 'item' property as information you want to extract from webpage, you can make custom procedure as you want.
      console.log(111)
    }
  }
};

const D = new downtune(coolapk);
D.start().then(() => console.log('finish'));
