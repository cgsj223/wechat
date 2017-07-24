const Wechat = require('./wechat.js');

module.exports=function(req,res){
  let wx=new Wechat(req,res);
  let data=req.body.xml;
  console.log(data);
  if(data){
    switch (data.msgtype){
      case "event":
      if(data.event==="subscribe"){
        wx.subcribe()
      }else if(data.event==="CLICK"){
        wx.handleEventKey(data.eventkey)
      }
      break;
      case "location":
        wx.userLocation()
      break;
      case "image":
        wx.replyText({text:"你的图片在下收到了，他日必有厚报"})
      break;
      case "video":
        wx.replyImage({id:"jLFTFFc2MsOnzDib_FzFLQZSeLQ1kD0mV1fUl8sDeQc"})
      break;
      case "text":
        switch(data.content){
          case "1":
            wx.replyText({text:"一个和尚没水喝"})
          break;
          case "2":
            wx.replyImage({id:"jLFTFFc2MsOnzDib_FzFLQZSeLQ1kD0mV1fUl8sDeQc"})
          break;
          case "3":
            let news_obj={
              title:"你想要的并不存在",
              description:"图文消息测试一记",
              picUrl:"http://mmbiz.qpic.cn/mmbiz_jpg/fc67kMfJsWdzhutPnENbYaSiaDj6cGOsicsC5ONYwBy7IvCmV5jP3qAoHNkcSLkkr4XicTdLMrIdq1Jdun8HsqSHQ/0",
              url:"www.qq.com"
            };
            wx.replyNews(news_obj);
          break;
          case "4":
            wx.replyVoice({id:"jLFTFFc2MsOnzDib_FzFLSr7eoyuAutxeIbUZsBP-6Q"})
          break;
        }
      break;
      case "voice":
        let content=data.recognition;
        wx.replyText({text:`<a href="https://www.baidu.com/s?wd=${content}">点击查看语音搜索结果</a>`})
      break;
    }
  }

}
