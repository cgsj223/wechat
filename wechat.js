const updateToken = require('./update_token.js');
const request = require('request');
const config = require('./config.js');
// const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class Wechat{
  constructor(req,res){
    this.req=req;
    this.res=res;
  }

//拼接回复的xml模板
  resXml(type,res_obj){
    let data=this.req.body.xml
    let toUsername=data.fromusername;
    let fromUsername=data.tousername;
    let resTime=new Date().getTime();
    let temp='';
    let prefix=`<xml>
          <ToUserName><![CDATA[${toUsername}]]></ToUserName>
          <FromUserName><![CDATA[${fromUsername}]]></FromUserName>
          <CreateTime>${resTime}</CreateTime>`;
      switch (type){
        case "text":
        temp=`${prefix}
              <MsgType><![CDATA[text]]></MsgType>
              <Content><![CDATA[${res_obj.text}]]></Content>
              </xml>`;
        break;
        case "image":
        temp=`${prefix}
        <MsgType><![CDATA[image]]></MsgType>
        <Image>
        <MediaId><![CDATA[${res_obj.id}]]></MediaId>
        </Image>
        </xml>`;
        break;
        case "news":
        temp=`${prefix}
          <MsgType><![CDATA[news]]></MsgType>
          <ArticleCount>1</ArticleCount>
          <Articles>
          <item>
          <Title><![CDATA[${res_obj.title}]]></Title>
          <Description><![CDATA[${res_obj.description}]]></Description>
          <PicUrl><![CDATA[${res_obj.picUrl}]]></PicUrl>
          <Url><![CDATA[${res_obj.url}]]></Url>
          </item>
          </Articles>
          </xml>`
        break;
        case "voice":
        temp=`${prefix}
        <MsgType><![CDATA[voice]]></MsgType>
        <Voice>
        <MediaId><![CDATA[${res_obj.id}]]></MediaId>
        </Voice>
        </xml>`;
        break;
      }
      return temp;
  }

//处理点击menu的事件
  handleEventKey(key){
    switch(key){
      case "text":
        this.replyText({text:"在下西门吹土，未请教阁下尊姓大名"});
      break;
      case "image":
        this.replyImage({id:"jLFTFFc2MsOnzDib_FzFLQZSeLQ1kD0mV1fUl8sDeQc"})
      break;
      case "news":
        let news_obj={
          title:"你想要的并不存在",
          description:"图文消息测试一记",
          picUrl:"http://mmbiz.qpic.cn/mmbiz_jpg/fc67kMfJsWdzhutPnENbYaSiaDj6cGOsicsC5ONYwBy7IvCmV5jP3qAoHNkcSLkkr4XicTdLMrIdq1Jdun8HsqSHQ/0",
          url:"www.qq.com"
        }
        this.replyNews(news_obj)
      break;
      case "music":
        this.replyVoice({id:"jLFTFFc2MsOnzDib_FzFLSr7eoyuAutxeIbUZsBP-6Q"})
      break;
    }
  }


//回复文字消息给用户
  replyText(word){
    let temp=this.resXml('text',word);
    this.res.send(temp);
  }

//回复图片消息给用户
  replyImage(obj){
    let temp=this.resXml('image',obj);
    this.res.send(temp)
  }

//回复图文消息给用户
  replyNews(obj){
    let temp=this.resXml('news',obj);
    this.res.send(temp);
  }

//回复音频文件给用户
  replyVoice(obj){
    let temp=this.resXml('voice',obj);
    this.res.send(temp);
  }

//用户关注公众号
  subcribe(){
      let welcome=`嘻嘻，欢迎订阅这个测试号。
1、回复数字1-4查看不同消息。
2、也可点击菜单查看消息。
3、支持上传图片、位置信息、视频。
4、上传语音将返回语音搜索结果。`;
      let resWord={
        text:welcome
      };
      this.replyText(resWord)
  }

//用户上传地理位置
  userLocation(){
    let resWord={
      text:'老乡，开开们啊！查水表的！'
    };
    this.replyText(resWord)
  }



//创建公众号表单，由于需要异步获取access_token,调用本方法时要确保已从微信获取access_token
  static createMenue(){
    let acsToken=updateToken.update();
    let data=config.weixin.menueData;
    let murl=`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${acsToken}`;
    request({
      url:murl,
      method:"POST",
      json:true,
      headers:{
        "content-type":"application/json",
      },
      body:data
    },function(err,res,body){
      if(err) return console.err(err);
      console.log(body);
    })
  }

  static uploadMaterials(type){
    let token=updateToken.update()
    let prefix=`https://api.weixin.qq.com/cgi-bin/`;
    let filepath=null;
    let postUrl=null;
    switch(type){
      case "image":
        postUrl=`${prefix}material/add_material?access_token=${token}&type=image`;
        filepath=__dirname+"/image/img1.jpg";
      break;
      case "coverImage":
        postUrl=`${prefix}media/uploadimg?access_token=${token}`;
        filepath=__dirname+"/image/cover.jpg";
      break;
      case "voice":
        postUrl=`${prefix}material/add_material?access_token=${token}&type=voice`;
        filepath=__dirname+"/voice/aya.wav";
      break;
    }

    let form={
      media:fs.createReadStream(filepath)
    }
    request.post({url:postUrl,formData:form},function(err,res,body){
      if(err) return console.log(err);
      let resData=JSON.parse(body)
      console.log(body);
      if(resData.url||resData.media_id){
        fs.appendFile((__dirname+"/material.txt"),(type+":"+body+"\n"),function(err){
          if(err)return console.log(err);
        })
      }
    });
  }


}

module.exports=Wechat;
