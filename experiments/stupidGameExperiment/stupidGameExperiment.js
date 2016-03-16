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

	Add bots, add players, make a game that does something basic which
	can take alternating, timed inputs. The game should also cycle through
	different states.
*/

app.get('/', function(req, res) {
	res.render('stupidGameExperiment.html');
});

io.on('connection', function(socket) {
	
});	

