var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
console.log('a user connected');

	socket.on('new user', function(data, callback){
		if (nicknames.indexOf(data) != -1) {
			console.log('same name');
			callback(false);
		} else {
			console.log('added name');
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	  });

	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	};
	
	socket.on('disconnect', function(){
	    console.log('user disconnected');

	    if (!socket.nickname) return;//they dc b4 setting name
	    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
	    updateNicknames();
	  });

  	socket.on('chat message', function(msg){
  		
    	io.emit('chat message', {data: msg, nick: socket.nickname});
  	  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});