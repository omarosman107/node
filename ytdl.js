//Lets require/import the HTTP module
var express = require('express');
var youtubedl = require('youtube-dl');
var app = express();

function handle(){
  console.log("THERE WAS AN ERROR")
}

//Lets define a port we want to listen to
const PORT = process.env.PORT || 8080;
//We need a function which handles requests and send response

app.get('/', function(req, res) {

     var showname = req.query.url
   console.log('User Is connecting')
        console.log(showname)

res.setHeader('Cache-Control', 'public, max-age=246000');
    res.header('Access-Control-Allow-Origin', '*');
var options = ['--username=user', '--password=hunter2'];
youtubedl.getInfo(showname, options, function(err, info) {
  if (err) handle();
try{
res.redirect(info.url)
} catch(e){
  console.log('url not found')
  res.send('the content that you are requesting is locked or not available')
}
});

});
app.listen(PORT);
console.log("Web Server Started On Port:" + PORT);

