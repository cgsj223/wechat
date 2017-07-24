const config = require('./config.js');
const sha1 = require('sha1');

module.exports=function (req, res, next){

    if(req.method==="GET"){
      let token = config.weixin.token
      let signature= req.query.signature
      let nonce=req.query.nonce
      let timestamp=req.query.timestamp
      let echostr=req.query.echostr
      let str=[token,timestamp,nonce].sort().join('')
      let sha=sha1(str)

      if(sha===signature){
        res.send(echostr+'')
      }else{
        res.send('wrong')
      }
    }else if(req.method==="POST"){
      next()
    }
}
