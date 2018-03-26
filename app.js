var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
const SHA256 = require("crypto-js/sha256");
//var server = require('http').createServer(app);  
var io = require('socket.io-client')//(server);
//var io2=require('socket.io-client');
app.use(express.static(__dirname + '/node_modules'));  
app.use(express.static(__dirname + 'socket.io-client/dist/socket.io')); 
var bodyParser = require("body-parser");
var con = mysql.createConnection({
    host: "localhost",
  user: "preetham",
  password: "mysql",
  database: "login"
})
  con.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

var port = process.env.PORT || 3000;
 app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/',function(req, res){
  res.sendFile(path.join(__dirname + '/public/login.html'));

});
var hash=" ";

 app.post('/myaction3', function(req,res){
var p = req.body.Select_party;
console.log(p);
con.query('UPDATE party SET vote = vote+1 WHERE name= ?',p,function(error,res,fields){

});
//console.log('hi');
con.query('SELECT * FROM party',function(err,results,f){
  console.log(results);
  res.send('Your vote has been recorded.');
});


 });
 
 

 
 
app.post('/myaction2',function(req,res){
var v_id = req.body.voter_id;
hash =  SHA256( JSON.stringify(v_id) ).toString();
//console.log(hash);
var socket = io.connect('http://192.168.1.7:3000');// ADDRESS AND PORT OF SERVER SHOULD BE MENTIONED HERE.
 socket.on('connect', function(data) {
  socket.emit('join', hash);
});
 
socket.on('broad',function(data){
   console.log(data);
   
   con.query('SELECT * FROM log2 WHERE hash=?',[data],function(error,results,fields){
    if(error){ 
      res.send({
        "code":400,
        "failed":"Some error occured"
      });
    }
    else{
        console.log('The solution is: ', results);
        if(results.length ==0)
        {   //var record = [ [ data ]]; 
         /*   con.connect(function(err){
  console.log('Connection established');
  if(err){
      console.log('Error connecting to Db');
      return;
  } else*/ 
                  
    var query = con.query('INSERT INTO log2 SET hash=?',data,function(error,results){
      if(error) console.log(error);
        console.log('db added');
        console.log(query.sql);
        //con.end();
    });
           
             res.sendFile(path.join(__dirname + '/public/voting_page2.html'));
             socket.destroy();
       }
        
        
    else if(results.length!=0){
      res.send({
        "code":204,
        "success":"Stop Cheating Start Living"
          }); socket.destroy();
        }
    }
  });
 

 });


});




//myaction 
app.post('/myaction',function(req,res){
  
   var uname = req.body.user;
   var pass = req.body.pwd;
    
   //res.send('Your name is ' + uname + '.' + 'Your password is ' + password);
   con.query('SELECT * FROM log WHERE name=? and password=?',[uname,pass], function (error, results, fields) {
  if(error) {
    // console.log("error ocurred",error);
       res.send({
      "code":400,
      "failed":"error ocurred"
       });
  }
  else{
    // console.log('The solution is: ', results);
        if(results.length >0)
        {
             res.sendFile(path.join(__dirname + '/public/voting_page.html'));
        }
        
        
    else{
      res.send({
        "code":204,
        "success":"name does not exits"
          });
        }
  }
  });

//con.end();
});
 

/*io.on('connection', function(client) {  
    console.log('Client connected...');

     
        //console.log(data);
        client.broadcast.emit('broad',hash);


    client.on('broad',function(data){
      con.query('SELECT * FROM log2 WHERE hash=?',[hash], function (error, results, fields) {
        if(error) {
    // console.log("error ocurred",error);
       res.send({
      "code":400,
      "failed":"error ocurred"
       });
  }
  else{
    // console.log('The solution is: ', results);
        if(results.length ==0)
        {    con.query('INSERT INTO log2 VAULES(hash)',function(){});
             res.sendFile(path.join(__dirname + '/public/Voting_recorded.html'));
        }
        
        
    else{
      res.send({
        "code":204,
        "success":"Stop Cheating Start Living"
          });
        }
  }
      });
    });
});*/
//app.listen(port);
 
 
app.listen(port);
