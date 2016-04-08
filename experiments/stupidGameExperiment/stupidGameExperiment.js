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

var game = {state: "start", object:{}};

io.on('connection', function(socket) {
	
	//When first connected, tell the socket about the current game state.
		//The client should be able to render based on that.
	socket.emit('s', game);
	socket.emit('id', socket.id);
	
	/*
		We can structure a game object to be created on a per room basis,
		that acts as a state machine for the state of the room.

		The object can be changed using a specific interface of getters and setters,
		which will be linked to events that trigger as different players modify the object.

		When the socket joins the object, it can be linked using something like:
			game.on('changeState', function(data) {socket.emit})
				in a more fine tuned way. 
			(We'll also need to block out information using the filteredMap on emit)
	*/
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