var express = require('express');
var app = express();
//var path = require('path');
//var mysql = require('mysql');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));
var bodyParser = require('body-parser');


io.on('connection', function(client){
	console.log('Client connected');
	client.on('join',function(data){
	console.log(data);
	client.emit('broad',data);
	client.broadcast.emit('broad',data);
	});
});

server.listen(3000);