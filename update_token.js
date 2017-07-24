const schedule = require('node-schedule');
const request = require('request');
const config = require('./config.js');

let token='';
let appID=config.weixin.appID;
let appSecret=config.weixin.appSecret;
let url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`;

request.get({url:url,json:true},function(e,res,data){
  token=data.access_token;
  
})

schedule.scheduleJob("1 1 * * * *",function(){
  request.get({url:url,json:true},function(e,res,data){
    token=data.access_token;
  })
})

module.exports={
  update:function(){
    return token
  }
};
