var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var con = mysql.createConnection({
    host: "localhost",
  user: "preetham",
  password: "mysql",
  database: "login"
})

var port = process.env.PORT || 3000;
 app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/',function(req, res){
  res.sendFile(path.join(__dirname + '/public/login.html'));

});

app.post('/myaction',function(req,res){
    con.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});
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
     console.log('The solution is: ', results);
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

con.end();
});
 
app.listen(port);