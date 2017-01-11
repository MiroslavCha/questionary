"use strict";
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/quest', function(req, res) {

	var per = req.query;

	// var encryptedAES = CryptoJS.AES.encrypt("Message", "My Secret Passphrase");
	// var decrypted    = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");

	var questions = JSON.parse(fs.readFileSync(__dirname + '/public/questions.json', 'utf8'));

	res.type('json');
	res.end(JSON.stringify({questions:questions}));
});

app.post('/quest', function(req, res) {
	var dataRecord = req.body.record;
}
)

var server = app.listen(8080, function () {
	console.log('Listenning on port 8080');
});
