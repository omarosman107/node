//Lets require/import the HTTP module
var express = require('express');
var fetch = require('node-fetch');
var app = express();



//Lets define a port we want to listen to
const PORT = 80;
//We need a function which handles requests and send response
app.get('/', function(req, res) {
   res.set('Content-Type', 'application/json');

   function useUrl(url) {
      res.send(url);
   }

   function fetchcwjson(value) {
      var videolink
      var stripped = value.split('?')[1].split("=")[1]
      fetch("http://metaframe.digitalsmiths.tv/v2/CWtv/assets/" + stripped + "/partner/154").then(function(response) {
         return response.json()
      }).then(function(data) {
         useUrl('{videourl: "' + data.videos.variantplaylist.uri + '",ShowName: "' + data.assetFields.seriesName + '",Episode: "' + data.assetFields.title + '",Description: "' + data.assetFields.description + '"}');
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
      useUrl('{videourl: "' + videourl + '",ShowName: "' + data.query.results.a[0].content + '",Episode: "' + data.query.results.div.content + '",Description: "' + data.query.results.meta.content + '"}');
   });
}
   fetch('https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&sig=0c3990ce7a056ed50667fe0c3873c9b6&cx=009916453314335219988:-0yvqrz4snu&q=' + req.url.split('=')[1]).then(function(response) {
      return response.json()
   }).then(function(googlejson) {
      googleurl = googlejson.results[0].unescapedUrl;
      foxurl = googlejson.results[0].unescapedUrl
      for (var i = 0; i < googlejson.results.length; i++) {
         if (typeof googlejson.results[i].richSnippet != "undefined") {
            if (googlejson.results[i].richSnippet.metatags.ogType == "video.episode") {
               console.log(googlejson.results[i].richSnippet.metatags.ogType)
               foxurl = googlejson.results[i].unescapedUrl
            }
         }
      }
      if (googlejson.results[0].unescapedUrl.includes("cwtv")) {
         console.log(googlejson.results["0"].richSnippet.metatags.ogUrl)
         cwurl = googlejson.results["0"].richSnippet.metatags.ogUrl
      }
      if (googleurl.includes("cw")) {
         console.log(" CW Detected")
         fetchcwjson(googleurl)
      }
      if (googleurl.includes("abc")) {
         console.log(" ABC Detected")
         fetchabcjson(googleurl)
      }
      if (googleurl.includes("nbc")) {
         console.log(" NBC Detected")
         fetchnbcjson(googleurl)
      }
      if (googleurl.includes("southpark")) {
         console.log(" South Park Detected")
         fetchsouthpjson(googleurl)
      }
      if (googleurl.includes("nick")) {
         console.log(" Nickelodeon Detected")
         fetchnickjson(googleurl)
      }
      if (googleurl.includes("cbs")) {
         console.log(" CBS Detected")
         fetchcbsjson(googleurl)
      }
      if (googleurl.includes("fox")) {
         console.log("Fox Detected")
         fetchfoxjson(foxurl)
      }
   })
});
app.listen(PORT);
console.log("Web Server Started On Port:" + PORT)