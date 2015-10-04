var http = require('http');
var mongoose =require('mongoose');
var qs = require('querystring');
var express=require('express');
var bodyParser = require('body-parser');
var app=express();
var bank=1000000000;
var id,count;
app.use( bodyParser.json() );
app.use(express.static('./')); 
app.use(bodyParser.urlencoded({     
  extended: true
}));

mongoose.connect('mongodb://localhost/bank');
	var Schema = mongoose.Schema({
		AccountNumber:Number,
		fname:String,
		lname:String,
		sex:String,
		dob:Date,
		_id:String,
		mobile:Number,
		balance:Number
		
});



var accounts = mongoose.model('accounts',Schema);

app.post('/account', function(req,res){
accounts.count({},function(err,c){
if(err) res.json(err);
else if(c==0) count=1;
else count=c;
id=bank+count;
new accounts({
                AccountNumber:id,
                fname:req.body.fname,
                lname:req.body.lname,
                sex: req.body.sex,
                dob : req.body.dob,
                _id : req.body.email,
                mobile:req.body.mobile,
                balance:req.body.balance
        }).save(function(err,doc){
                if(err) res.json(err);
                else res.send('successfully inserted');
        });
});
});
//app.listen(3000);

/*app.get('/view', function(req, res){
	accounts.find({}, function(err, docs){
		if(err) res.json(err);
		else    res.render(docs);
	});
});*/

app.post('/credit',function(req,res){
accounts.find({AccountNumber:req.body.account},function(err,docs){
if(err){ res.write("No Account with this number found");
console.log("if");}
else{
console.log("else");
//res.setHeaders("Access-Control-Allow-Origin","localhost:3000");
//res.setHeaders("Access-Control-Allow-Method","POST");
//res.setHeaders("Access-Control-Allow-Origin","X-Requested-With,content-type");
//var doc=JSON.parse(docs);
//console.log(docs);
res.writeHead(200,{"Content-Type":"text/html"});
res.write('<html>'+
'<head>'+
'<title>Verify</title>'+
'<link rel="stylesheet" href="creditstyle.css" type="text/css">'+
'</head>'+
'<body>'+
'<form id="register" class="form" method="post" action="http://localhost:3000/credit">'+
'<fieldset class="form field">'+
'<dl>'+
'<dt><label>Account Number</label></dt>'+
'<dd><div>'+docs[0].AccountNumber+'</div></dd>'+
'<dt><label>Name</label></dt>'+
'<dd><div>'+docs[0].fname+docs[0].lname+'</div></dd>'+
'<dt><label>Email</label></dt>'+
'<dd><div>'+docs[0]._id+'</div></dd>'+
'</dl>'+
'<input type="submit" class="submit" id="confirm" name="confirm" value="Confirm">'+
'<div class="submit"><p>      </p></div>'+
'<input type="button" class="submit" id="cancel" name="cancel" value="Cancel">'+
'</fieldset>'+
'</form>'+
'<body>'+
'</html>');
//res.write(JSON.stringify(docs));
res.end();
}

});
});
app.listen(3000);
