//Lets require/import the HTTP module
var express = require('express');
var fetch = require('node-fetch');
var app = express();



//Lets define a port we want to listen to
const PORT = process.env.PORT || 8080;
//We need a function which handles requests and send response

app.get('/', function(req, res) {

     var showname = req.query.url
     fetch(req.query.url).then(function(resp){      res.send(resp.headers._headers);console.log(resp.headers);res.setHeader('Content-Type', resp.headers['content-type']);return resp.text()}).then(function(data){
      res.send(data);

     }).catch(function(e){
console.log(e)
})
   console.log('User Is connecting')
        console.log(showname)

res.setHeader('Cache-Control', 'public, max-age=246000');
    res.header('Access-Control-Allow-Origin', '*');


   })
app.listen(PORT);
console.log("Web Server Started On Port:" + PORT);


