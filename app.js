const express = require('express');
const check = require('./check.js');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const userAction = require('./user_action.js');

let app=express()


app.use(check);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(xmlparser({trim:true,explicitArray:false}));
app.use(userAction);

app.listen(1234,()=>{
  console.log('sever is running');
})
