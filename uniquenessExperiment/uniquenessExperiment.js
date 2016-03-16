var 
	express = require('express'),
	app = express(),
	io = require('socket.io').listen(app.listen(3000)),
	hbs = require('hbs');

app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
app.set('views', './');
app.use('/public', express.static(__dirname + '/public'));

/*
	Show cards differently to each user. Hide cards that are not your own.

	What do we key sockets against? 
	socket.id would be a good starting point I guess. 
	But is this socket.id the same for each IP?
	
	Screw reconnect logic. Sit in the seat when you want and lose as much as you want.
*/

var map = {};
var filteredMap = {};
var cards = [];
var drawn = [];

var values = ["1", "2", "3", "4", "5", "6", "7", "8", "9",
			"T", "J", "Q", "K"];

var suits = ["D", "C", "H", "S"];

function resetDeck() {
	map = {};
	filteredMap = {};
	drawn = [];
	cards = [];
	suits.forEach(function(s) {
		values.forEach(function(v) {
			cards.push(v+s);
		});
	});
}

function drawCard(socketId) {
	
	if (!map[socketId]) {
		map[socketId] = [];
		filteredMap[socketId] = [];
	}

	if (cards.length > 0) {
		var draw = cards.splice(Math.floor(Math.random() * cards.length), 1);
		map[socketId].push(draw);
		filteredMap[socketId].push('X');
		drawn.push(draw);
		return true;
	} else {
		return false;
	}
}

function defilterMap(socketId) {
	var outputMap = JSON.parse(JSON.stringify(filteredMap));
	outputMap[socketId] = map[socketId];
	return outputMap;
}

function broadcastCards(socket) {
	//socket.nsp.sockets stores all sockets for a room/namespace
	for (var prop in socket.nsp.sockets) {
		var cSocket = socket.nsp.sockets[prop];
		cSocket.emit('m', defilterMap(cSocket.id));
	}
}

resetDeck();

app.get('/', function(req, res) {
	res.render('uniquenessExperiment.html');
});

io.on('connection', function(socket) {
	socket.emit('m', defilterMap(socket.id));
	socket.emit('n', socket.id);

	socket.on('clear', function() {
		resetDeck();
		io.emit('m', {});
	});

	socket.on('draw', function() {
		if (drawCard(socket.id)) {
			broadcastCards(socket);
		} else {
			socket.emit('w', "out of cards");
		}
	});
});	

