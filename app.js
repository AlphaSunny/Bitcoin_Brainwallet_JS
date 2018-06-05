var express = require("express");
var app = express();
var request = require("request");
var bodyparser = require("body-parser");
var bitcore = require("bitcore-lib")

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

function brainWallet(uinput, callback) {
    var buf = new Buffer(uinput);
    var hash = bitcore.crypto.Hash.sha256(buf);
    var bn = bitcore.crypto.BN.fromBuffer(hash);
    var pk = new bitcore.PrivateKey(bn).toWIF();
    var addy = new bitcore.PrivateKey(bn).toAddress();
    var balance =1;
    callback(pk, addy, balance);
}

request({
    url: "https://blockchain.info/rawaddr/" + "1xm4vFerV3pSgvBFkyzLgT1Ew3HQYrS1V",
    json:true 
}, function(error, response, body){
    balance = body.total_sent;
});

app.get("/", function(req, res){
    res.sendfile(__dirname + "/index.html");
});

app.post("/wallet", function(req, res) {
    var brainsrc = req.body.brainsrc;
    console.log(brainsrc);
    brainWallet(brainsrc, function(priv, addr, bal){
        res.send("The Brain Wallet of:" + brainsrc + "<br>Addy: " + addr + "<br>Private Key: " + priv + "<br>Balance: " + bal);
    });
});

app.listen(8080, function(){
    console.log("go");
});