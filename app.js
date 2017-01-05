"use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var questions = [
	{text: "Hello How are you?", cnt: 1},
	{text: "What is new", cnt: 2},
];

app.use(express.static(__dirname + '/public'));

app.get('/quest', function(req, res) {

var per = req.query;

res.type('json');
res.end(JSON.stringify({questions:questions}));
});

var server = app.listen(8080, function () {
	console.log('Listenning on port 8080');
});
