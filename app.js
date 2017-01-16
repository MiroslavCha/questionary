"use strict";
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var CryptoJS = require('crypto-js');
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
						encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},
						decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0, c1, c2;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

app.get('/quest', function(req, res) {

	var per = req.query;

	var questions = JSON.parse(fs.readFileSync(__dirname + '/public/questions.json', 'utf8'));

	var item = {feedback_name: '', cnt:-1};
	item.feedback_name = Base64.decode(req.query.id1);

	questions.push(item);

	var item = {role_name: '', cnt:-1};
	item.role_name = Base64.decode(req.query.id2);

	questions.push(item);

	res.type('json');
	res.end(JSON.stringify({questions:questions}));
});

app.post('/quest', function(req, res) {
	var dataRecord = req.body.record;
	var ipAddress = req.ip;
	var dbname = '';
	var role = '';
	var commentGood = '';
	var commentBad = '';
	var answers = [];

	console.log(dataRecord);

	for (var i = 0; i < dataRecord.length; i++)
	{
		var obj = dataRecord[i];

		if (obj.id == "name") {
			dbname = Base64.decode(obj.val);
		} else if (obj.id == "role") {
			role = Base64.decode(obj.val);
		} else if (obj.id == "comment-good") {
			if (obj.val) {
				commentGood = obj.val;
			}
			else {
				commentGood = 'none';
			}
		} else if (obj.id == "comment-bad") {
			if (obj.val) {
				commentBad = obj.val;
			}
			else {
				commentBad = 'none';
			}
		}
		else {
			if (obj.val) {
				answers[obj.id] = obj.val;
			}
			else {
				answers[obj.id] = -1;
			}
		}
	}

	console.log('Database name:' + dbname);

	const pg = require('pg');
	const connectionString = 'postgres://Katka@localhost:5432/questionnaire';
	const results = [];

	pg.connect(connectionString, function (err, client, done)
	{
  	//Err - This means something went wrong connecting to the database.
  	if (err) {
			done();
    	console.error(err);
    	process.exit(1);
  	}

		var results = [];
		var que = 'SELECT * FROM ' + dbname + ' WHERE ip = \'' + ipAddress + '\';'

		const query = client.query(que, function (err, result) {
			if (err) {
				done();
				return console.error('error happened during select query', err);
			}
		});
	 	// Stream results back one row at a time
	 	query.on('row', (row) => {
		 	results.push(row);
	 	});

    query.on('end', () => {
		//check ip
		if (results.length == 0)
		{
			console.log("Zaznam este neexistuje");

			var que = 'INSERT INTO ' + dbname + ' (role_name, ans1, ans2, ans3, ans4, ans5, ans6, ans7, ans8, ans9, ans10, \
				ans11, ans12, ans13, ans14, ans15, ans16, ans17, ans18, ans19, ans20, ans21, ans22, ans23, ans24, \
				ans25, ans26, ans27, ans28, ans29, ans30, ans31, ans32, ans33, ans34, ans35, ans36, ans37, ans38, \
				comment_good, comment_bad, ip) values ('
				+ '\'' + role + '\', ' + answers[1] + ', ' + answers[2] + ', ' + answers[3] + ', ' + answers[4] + ', '
				+ answers[5] + ', ' + answers[6] + ', ' + answers[7] + ', ' + answers[8] + ', ' + answers[9] + ', '
				+ answers[10] + ', ' + answers[11] + ', ' + answers[12] + ', ' + answers[13] + ', ' + answers[14] + ', '
				+ answers[15] + ', ' + answers[16] + ', ' + answers[17] + ', ' + answers[18] + ', ' + answers[19] + ', '
				+ answers[20] + ', ' + answers[21] + ', ' + answers[22] + ', ' + answers[23] + ', ' + answers[24] + ', '
				+ answers[25] + ', ' + answers[26] + ', ' + answers[27] + ', ' + answers[28] + ', ' + answers[29] + ', '
				+ answers[30] + ', ' + answers[31] + ', ' + answers[32] + ', ' + answers[33] + ', ' + answers[34] + ', '
				+ answers[35] + ', ' + answers[36] + ', ' + answers[37] + ', ' + answers[38] + ', \'' + commentGood + '\', \''
				+ commentBad + '\', \'' + ipAddress + '\');';

			console.log(que);

			client.query(que, function(err, result) {
					done();
					if (err) {
        		return console.error('error happened during insert query', err);
      		}
				});
		}
		else {
			console.log("Zaznam uz existuje");
		}
	});
	});


	//res.status(404).end();
	res.status(200).end();
}
)

generateLinks();

var server = app.listen(8080, function () {
	console.log('Listenning on port 8080');
});

function generateLinks()
{
	console.log("Generating links");

	var table = [];
	table[0] = "marianboda";
	table[1] = "rudolfdobrovic";
	table[2] = "radokokula";
	table[3] = "jurajandris";
	table[4] = "petergejgus";
	table[5] = "lukasondriga";
	table[6] = "michalsvoboda";
	table[7] = "adrienavrbova";
	table[8] = "selffeedback";
	table[9] = "mate";
  table[10] = "subordinate";
	table[11] = "supervisor";

	for (var i = 0; i < table.length; i++) {
		var code = Base64.encode(table[i]);
		console.log(table[i] + " : " + code);

	}
}
