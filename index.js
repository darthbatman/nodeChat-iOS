var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var ipAdd;

mongoose.connect('mongodb://localhost/test');

var user = mongoose.model('users', {name: String, password: String});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var userName = "";
var password = "";
var chatName = "";
var chatterIP = "";

app.post('/signup', function(req, res){
	user.findOne({name: req.body.signupUsername}, function(err, theUser){
		if (!theUser){
			if(req.body.signupPassword == req.body.signupPasswordConfirm){
				var SU_user = new user({
					name: req.body.signupUsername,
					password: req.body.signupPassword
				});
				SU_user.save();
				console.log("New user added. Name: " + req.body.signupUsername);
				res.send("New user added. Name: " + req.body.signupUsername);
			}
			else {
				res.send('Error: Passwords do not match.');
			}
		}
		else {
			res.send('Error: Username is already in use.');
		}
	});
});

app.post('/login', function(req, res) {
  userName = req.body.username;
  password = req.body.password;
  user.find({name: userName}, function(err, docs){
  	//console.log('docs length = ' + docs.length);
  	if (docs.length != 0) {
  		//parse password from docs object
  		console.log(docs[0].password);
  		if (password == docs[0].password) {
	  	/*
	  	chatterIP = '' + req.connection.remoteAddress;
	  	user.update({name: userName}, {name: userName, password: password, connection: chatterIP}, function(){
	  		console.log(userName + ' updated with connection: ' + chatterIP);
	  	});
		*/
	  	//res.send('Login successful.<br>You sent the name "' + req.body.username + '".');
	  	res.sendFile(__dirname + '/index.html');
	  	console.log('Login successful.');
	  	chatName = userName;

	  }
	  else {
	  	res.send('Login failed.<br>You sent the name "' + req.body.username + '".');
	  	console.log('Login failed.');
	  }
	}
	else {
		res.send('Login failed.<br>You sent the name "' + req.body.username + '".');
	  	console.log('Login failed.');
	}
  });
});



var testString = 'hello';
testString = '/' + testString;

app.get(testString, function(req, res){
	res.send('<h1>Hello there for the test String</h1>');
});



app.get('/', function(req, res){
	res.sendFile(__dirname + '/login.html');
	console.log("Someone accessed the website.");
	//res.sendFile(__dirname + '/index.html');
	ipAdd = req.connection.remoteAddress;
});

var appUsername;

io.on('connection', function(socket){
	//socket.username = chatName;
	//console.log(socket.handshake.address);
 	//console.log(socket.client.conn.remoteAddress);

 	socket.on('typing', function(){
 		console.log(socket.username + ' is typing.');
 		var typeState = socket.username + ' is typing.';
 		//io.emit('is typing', typeState);
 		socket.broadcast.emit('is typing', typeState);
 	});

 	socket.on('stopped typing', function(){
 		console.log(socket.username + ' stopped typing.');
 		//io.emit('not typing');
 		socket.broadcast.emit('not typing');
 	});

 	

 	socket.on("Login Attempt", function(appUser, appPass){
 		console.log(appUser + ": " + appPass);
 		user.find({name: appUser}, function(err, docs){
 			if (appPass == docs[0].password) {
 				appUsername = appUser;
 				console.log("Login successful for " + appUsername);
 				io.emit('Login Successful');
 			}
 
 		});
 	});

 	socket.on('message from mobile', function(mobileMSG){
 		mobileMSG = appUsername + ": " + mobileMSG;
 		io.emit('chat message', mobileMSG);
 	});

	socket.on('chat message', function(msg){
		// if (socket.username != appUsername) {
		// 	socket.username = chatName;
		// }
		socket.username = chatName;
		// if (!socket.username || socket.username == "undefined") {
		// 	socket.username = appUsername;
		// }

		
		console.log(socket.username);
		console.log(socket.handshake.address);
  		//console.log(socket.client.conn.remoteAddress);
  		/*
  		var handAdd = '' + socket.handshake.address;
  		user.find({connection: handAdd}, function(err, docs){
  			chatName = docs[0].name;
  		});
		*/
		console.log('message: ' + msg);
		msg = socket.username + ': ' + msg;
		console.log(msg);
		io.emit('chat message', msg);
	});
});



http.listen(8080, function(){
	console.log('listening on *:8080');
});
