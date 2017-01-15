//Lets require/import the HTTP module
var express = require('express');
var fetch = require('node-fetch');
var request = require('request')


var app = express();

var isDone = false
var foxurl
var cwurl
var url



//Lets define a port we want to listen to
const PORT = process.env.PORT || 8080;
//We need a function which handles requests and send response

app.get('/show', function(req, res) {

     var showname = req._parsedUrl.query

   console.log('User Is connecting')
        console.log(showname)

   res.setHeader('Content-Type', 'application/json');
   res.setHeader('Cache-Control', 'public, max-age=31557600');


   function useUrl(url) {
      res.send(url);
   }

function fetchcwjson(value) {
      var videolink
      var stripped = value.split("=")[1]
      fetch("http://metaframe.digitalsmiths.tv/v2/CWtv/assets/" + stripped + "/partner/154").then(function(response) {
         return response.json()
      }).then(function(data) {

         useUrl('{"videourl": "' + data.videos.variantplaylist.uri + '","ShowName": "' + data.assetFields.seriesName + '","Episode": "' + data.assetFields.title + '","Description": "' + data.assetFields.description + '"}');
      })
   }
   function fetchcbsjson(value) {
   if (value.includes('http')) {
      searchValue = value.split('/')[6]
   } else {
      searchValue = value.split('/')[4]
   }
   if (value.slice(-1) == "/") {
      value = value.slice(0, -1)
   }
   console.log(searchValue)
   fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'" + value + "%2F'%20and%20compat%3D%22html5%22%20and%20xpath%3D%22%2F%2Fa%5B%40class%3D'show-title'%5D%7C%2F%2Fdiv%5B%40class%3D'title'%5D%7C%2F%2Fhead%2Fmeta%5B%40property%3D'og%3Adescription'%5D%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&_maxage=2592000&callback=").then(function(response) {
      return response.json()
   }).then(function(data) {
      videourl = "https://link.theplatform.com/s/dJ5BDC/media/guid/2198311517/" + searchValue + "?mbr=true&manifest=m3u&form=json"
      useUrl('{"videourl": "' + videourl + '","ShowName": "' + data.query.results.a[0].content + '","Episode": "' + data.query.results.div.content + '","Description": "' + data.query.results.meta.content + '"}');
   });
}
function fetchfoxjson(value) {
   var epiname
      // url (required), options (optional)
   fetch("https://feed.theplatform.com/f/fox.com/fullepisodes?form=json&range=1-1&byCustomValue={fox:freewheelId}{" + value.split('watch/')[1].split("/")[0] + "}", {
      method: 'get'
   }).then(function(response) {
      return response.json()
   }).then(function(data) {
epiname = (data.entries["0"].title)

         // url (required), options (optional)
      fetch('https://feed.theplatform.com/f/fox.com/metadata?count=true&byCustomValue={fullEpisode}{true}&range=0-1&q=' + epiname, {
         method: 'get'
      }).then(function(response) {
         return response.json()
      }).then(function(final) {
   useUrl('{"videourl": "' + final.results["0"].videoURL.split('?')[0] + "?mbr=true&manifest=m3u&metafile=false" + '","ShowName": "' + data.entries["0"].fox$series + '","Episode": "' + epiname + '","Description": "' + data.entries["0"].description + '"}');
 })
  
   })

}
   

var sitefunctions = {

"cwtv.com":"fetchcwjson(url)",
"diziay.com":"fetchdiziayjson(url)",
"adultswim.com":"fetchaswimjson(url)",
"cwseed.com":"fetchcwjson(url)",
"nick.com":"fetchnickjson(url)",
"abc.go.com":"fetchabcjson(url)",
"southpark.com":"fetchsouthpjson(url)",
"amc.com":"fetchamcjson(url)",
"cbs.com":"fetchcbsjson(url)",
"nbc.com":"fetchnbcjson(url)",
"fox.com":"fetchfoxjson(url)"




}
for (tv in sitefunctions) {

      if (showname.includes(tv)) {
console.log(tv + " "+"Detected")
url = showname
             eval(sitefunctions[tv]);
             isDone = true
} 
}










if (isDone == false) {googleAPI(showname);}
});
app.listen(PORT);
console.log("Web Server Started On Port:" + PORT);





   function googleAPI(value){
fetch('https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&sig=0c3990ce7a056ed50667fe0c3873c9b6&cx=009916453314335219988:-0yvqrz4snu&q=' + value).then(function(response) {
      return response.json()
   }).then(function(googlejson) {
      googleurl = googlejson.results[0].unescapedUrl;
      console.log(googleurl)
      foxurl = googlejson.results[0].unescapedUrl
            cwurl = googlejson.results[0].unescapedUrl


          for (var i = 0; i < googlejson.results.length; i++) {






if (JSON.stringify(googlejson.results[i]).includes('ogType')) {
  if (googlejson.results[i].richSnippet.metatags.ogType == "video.episode") {
                console.log("worked")


              foxurl = googlejson.results[i].unescapedUrl;
                            cwurl = foxurl

              if (foxurl.includes('fox.com')) {
console.log(foxurl)

              }
           

if (JSON.stringify(googlejson.results[i]).includes('ogUrl')) {
   console.log("worked")

              cwurl = googlejson.results[i].richSnippet.metatags.ogUrl
             
}


             }






}



}


      for (tv in sitefunctions) {
url = googleurl
 if (url.includes(tv)) {
console.log(tv + " "+"Detected")

if (tv == "cwtv.com") {
   url = cwurl

}
if (tv == "fox.com") {
   url = foxurl

}

             eval(sitefunctions[tv]);
             isDone = true

} 
}
   })
}
