
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var admin = require('./routes/admin');
var client = require('./routes/client');
var server = require('./routes/server');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', client.index);
app.get('/admin', admin.index)
app.get('/server', server.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
	socket.emit('news', {hello: 'world'});
	socket.on('my other event', function(data) {
		console.log(data);
	});
});