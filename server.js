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
var transaction=mongoose.Schema({
AccountNumber:Number,
Status:String,
_id:Number
});


var accounts = mongoose.model('accounts',Schema);
var transactions = mongoose.model('transactions',transaction);

app.post('/account', function(req,res){
accounts.count({},function(err,c){
if(err) res.json(err);
else if(c==0) count=0;
else count=c;
id=bank+count+1;
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

app.post('/credit',function(req,res){
accounts.find({_id:req.body.account},function(err,docs){
if(err){ res.write("No Account with this number found");
}
else{
//res.setHeaders("Access-Control-Allow-Origin","localhost:3000");
//res.setHeaders("Access-Control-Allow-Method","POST");
//res.setHeaders("Access-Control-Allow-Origin","X-Requested-With,content-type");
res.writeHead(200,{"Content-Type":"text/html"});
res.write('<html>'+
'<head>'+
'<title>Verify</title>'+
'<link rel="stylesheet" href="creditstyle.css" type="text/css">'+
'</head>'+
'<body>'+
'<form id="register" class="form" method="post" action="http://104.215.190.249:3000/creditconfirm">'+
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
//'<input type="button" class="submit" id="cancel" name="cancel" value="Cancel">'+
'</fieldset>'+
'</form>'+
'<body>'+
'</html>');
res.end();
}

});
});
app.post('/creditconfirm',function(req,res)
{
	//console.log(req.body.accountNumber);
	accounts.find({_id:req.body.accountNumber},function(err,docs)
	{
		if(err) res.json(err);
		else
		{
			var total=eval(parseInt(docs[0].balance)+parseInt(req.body.balance));
			accounts.findByIdAndUpdate({_id:req.body.accountNumber},
			{balance:total},
			function(err,docs)
			{
				if(err){ res.json(err);}
				else
				{
					transactions.count({},function(err,c)
					{
						if(err) res.json(err);
						else if(c==0) count=0;
						else count=c;
						transaction_id=count+1;

						new transactions({
							_id:transaction_id,
							AccountNumber:req.body.accountNumber,
							Status:"Credited"
						}).save(function(err,doc)
						{
							if(err) res.json(err);
						});						
					});
					console.log(transaction_id);
					transactions.find({_id:transaction_id},function(err,docs)
					{
						if(err){res.json(err);}
						else
						{
							//res.write("Credited");
							res.write('<html>'+
							'<head>'+
							'<title>Verify</title>'+
							'<meta http-equiv="refresh" content="2; url=http://104.215.190.249:3000/credit.html">'+
							'</head>'+
							'<body>'+
							'<h4>Credited Successfully.Transaction id is'+docs[0]._id+' </h4>'+
							'<p>redirecting...</p>'+
							'<body>'+
							'</html>');
							res.end();
						}
					});
				}
			});
		}
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
'<form id="register" class="form" method="post" action="http://104.215.190.249:3000/debitconfirm">'+
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
transactions.count({},function(err,c){
if(err) res.json(err);
else if(c==0) count=1;
else count=c;
transaction_id=count+1;
new transactions({
                _id:transaction_id,
                AccountNumber:req.body.accountNumber,
				Status:"Debited"
        }).save(function(err,doc){
                if(err) res.json(err);
        });
});
//res.write("Credited");
res.write('<html>'+
'<head>'+
'<title>Verify</title>'+
'<meta http-equiv="refresh" content="2; url=http://104.215.190.249:3000/debit.html">'+
'</head>'+
'<body>'+
'<h4>Debited Successfully.Transaction id is'+transaction_id+'</h4>'+
'<p>redirecting...</p>'+
'<body>'+
'</html>'
);
res.end();
}
});}
else{
res.send("Not enough Balance");
}
}
});
});

app.post('/delete', function(req,res){
accounts.findByIdAndRemove({_id:req.body.account},function(err,docs){
if(err){res.json(err);}
else{res.write('<html>'+
'<head>'+
'<title>Verify</title>'+
'<meta http-equiv="refresh" content="2; url=http://104.215.190.249:3000/delete.html">'+
'</head>'+
'<body>'+
'<h4>Deleted Successfully.</h4>'+
'<p>redirecting...</p>'+
'<body>'+
'</html>'
);
res.end();}
});
});

app.listen(3000);
