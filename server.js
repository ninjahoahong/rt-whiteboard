var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

server.listen(3000);

// view engine
app.set('view engine', 'jade');
app.set('views', './views');

// static folder
app.use(express.static('./public'));

app.get('/', function(req, res){
    res.render('index');
});

io.sockets.on('connection', function(socket){
    socket.on('drawing', function(x, y, type){
        io.sockets.emit('draw', x, y, type);
    });
});

