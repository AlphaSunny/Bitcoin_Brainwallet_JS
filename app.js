var express = require("express");
var app = express();
var request = require("request");
var bodyparser = require("body-parser");
var bitcore = require("bitcore-lib")

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.set("view engine", "ejs");

function brainWallet(uinput, callback) {
    var buf = new Buffer(uinput);
    var hash = bitcore.crypto.Hash.sha256(buf);
    var bn = bitcore.crypto.BN.fromBuffer(hash);
    var pk = new bitcore.PrivateKey(bn).toWIF();
    var addy = new bitcore.PrivateKey(bn).toAddress();
    var balance =1;
    callback(pk, addy, balance);
}

//请求coinbase的api来得到比特币的最新价格
function getPrice(returnPrice) {
    request({
        url: "https://api.coinbase.com/v2/prices/spot?currency=USD",
        json: true
    }, function(err, res, body) {
        returnPrice(body.data.amount);
    });
};

//得到address对应的balance的值
function getBalance(address, returnBalance) {
    request({
        url: "https://blockchain.info/rawaddr/" + address,
        json:true 
    }, function(error, response, body){
        returnBalance(body.final_balance);
    });
};



app.get("/", function(req, res){
    getPrice(function(price) {
        res.render("index", {
            lastPrice: price
        });
    });
});


//得到比特币的最新价格
app.get("/brain", function(req, res){
    getPrice(function(price) {
        res.render("brain", {
            lastPrice: price
        });
    });
});

app.get("/converter", function(req, res){
    getPrice(function(price) {
        res.render("converter", {
            lastPrice: price
        });
    });
});


//核心方法，两个callback，首先根据用户的输入得到该 密码对应得 私钥或者公钥，然后通过api请求来获得该地址对应得钱
app.post("/wallet", function(req, res) {
    var brainsrc = req.body.brainsrc;
    console.log(brainsrc);
    brainWallet(brainsrc, function(priv, addr, bal){
        getBalance(addr, function(balance) {
            res.send("The Brain Wallet of:" + brainsrc + "<br>Addy: " + addr + "<br>Private Key: " + priv + "<br>The balance: " + balance );
        })
    });


});

app.listen(8080, function(){
    console.log("go");
});


