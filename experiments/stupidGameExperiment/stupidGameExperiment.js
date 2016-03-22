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
	This experiment should be about structuring logic more than anything.

	Add bots, add players (join), make a game that does something basic which
	can take alternating, timed inputs. The game should also cycle through
	different states.
*/

app.get('/', function(req, res) {
	res.render('stupidGameExperiment.html');
});

io.on('connection', function(socket) {
	console.log("First");
	socket.emit("m", "Pikachu!");
});

io.on('connection', function(socket) {
	console.log("Second");
	socket.emit("m", "I choose you!");
});

/*
	One of the connected game clients will send an integer denoting the number of players
		* Who starts the game? Should it be a room master or should it be free for all?
			I'm inclined to go with free-for-all right now.

	Server will answer with an object/signal which the clients will render as empty seats

	From there, clients will be able to modify the seats to join the game or list a bot in the seats.
		Bot list may be communicated from server-side?

	Game starts, somebody acts as first player

	Game plays out, does something stupid, takes input from everybody, moves into different states

	Game ends, lobby is destroyed
*/