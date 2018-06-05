var express = require("express");
var app = express();
var request = require("request");
var bodyparser = require("body-parser");

request({
    url: "https://blockchain.info/rawaddr/" + "1xm4vFerV3pSgvBFkyzLgT1Ew3HQYrS1V",
    json:true 
}, function(error, response, body){
    bitprice = body.total_sent;

});

app.get("/", function(req, res){
    res.send("Bitcoin price now:" + bitprice);
});

app.get("/block", function(req, res) {
    res.sendfile("index.html");
});

app.listen(8080, function(){
    console.log("go");
});