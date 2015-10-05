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
		_id:Number,
		fname:String,
		lname:String,
		sex:String,
		dob:Date,
		email:String,
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
                _id:id,
                fname:req.body.fname,
                lname:req.body.lname,
                sex: req.body.sex,
                dob : req.body.dob,
                email : req.body.email,
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
accounts.find({_id:req.body.account},function(err,docs){
if(err){ res.write("No Account with this number found");
//console.log("if");
}
else{
//res.setHeaders("Access-Control-Allow-Origin","localhost:3000");
//res.setHeaders("Access-Control-Allow-Method","POST");
//res.setHeaders("Access-Control-Allow-Origin","X-Requested-With,content-type");
//console.log(docs[0]._id);
res.writeHead(200,{"Content-Type":"text/html"});
res.write('<html>'+
'<head>'+
'<title>Verify</title>'+
'<link rel="stylesheet" href="creditstyle.css" type="text/css">'+
'</head>'+
'<body>'+
'<form id="register" class="form" method="post" action="http://localhost:3000/creditconfirm">'+
'<fieldset class="form field">'+
'<dl>'+
'<dt><label>Account Number</label></dt>'+
'<dd><input type="text" name="accountNumber" id="accountNumber" value="'+docs[0]._id+'"readonly></dd>'+
'<dt><label>Name</label></dt>'+
'<dd><input type="text" name="fullname" id="fullname" value="'+docs[0].fname+'  '+docs[0].lname+'"readonly></dd>'+
'<dt><label>Balance</label></dt>'+
'<dd><input type="text" name="balance" id="balance" value="'+req.body.amount+'"readonly></dd>'+
'</dl>'+
'<input type="submit" class="submit" id="confirm" name="confirm" value="Confirm">'+
'<input type="button" class="submit" id="cancel" name="cancel" value="Cancel">'+
'</fieldset>'+
'</form>'+
'<body>'+
'</html>');
res.end();
}

});
});
app.post('/creditconfirm',function(req,res){
//console.log(req.body.accountNumber);
accounts.find({_id:req.body.accountNumber},function(err,docs){
if(err) res.json(err);
else{
var total=eval(parseInt(docs[0].balance)+parseInt(req.body.balance));
accounts.findByIdAndUpdate({_id:req.body.accountNumber},
{balance:total},
function(err,docs){
if(err){ res.json(err);}
else
{
//res.write("Credited");
res.redirect("./credit.html");
}
});}
});
});

app.post('/debit',function(req,res){
accounts.find({_id:req.body.account},function(err,docs){
if(err){res.send("No account with this number found");}
else{
res.writeHead(200,{"Content-Type":"text/html"});
res.write('<html>'+
'<head>'+
'<title>Verify</title>'+
'<link rel="stylesheet" href="creditstyle.css" type="text/css">'+
'</head>'+
'<body>'+
'<form id="register" class="form" method="post" action="http://localhost:3000/debitconfirm">'+
'<fieldset class="form field">'+
'<dl>'+
'<dt><label>Account Number</label></dt>'+
'<dd><input type="text" name="accountNumber" id="accountNumber" value="'+docs[0]._id+'"readonly></dd>'+
'<dt><label>Name</label></dt>'+
'<dd><input type="text" name="fullname" id="fullname" value="'+docs[0].fname+'  '+docs[0].lname+'"readonly></dd>'+
'<dt><label>Balance</label></dt>'+
'<dd><input type="text" name="balance" id="balance" value="'+req.body.amount+'"readonly></dd>'+
'</dl>'+
'<input type="submit" class="submit" id="confirm" name="confirm" value="Confirm">'+
'<input type="button" class="submit" id="cancel" name="cancel" value="Cancel">'+
'</fieldset>'+
'</form>'+
'<body>'+
'</html>');
res.end();
}
});
});

app.post('/debitconfirm',function(req,res){
//console.log(req.body.accountNumber);
accounts.find({_id:req.body.accountNumber},function(err,docs){
if(err) res.json(err);
else{
var total=eval(parseInt(docs[0].balance)-parseInt(req.body.balance));
if(total>0){
accounts.findByIdAndUpdate({_id:req.body.accountNumber},
{balance:total},
function(err,docs){
if(err){ res.json(err);}
else
{
//res.write("Credited");
res.redirect("./debit.html");
}
});}
else{
res.send("Not enough Balance");
}
}
});
});

app.listen(3000);
