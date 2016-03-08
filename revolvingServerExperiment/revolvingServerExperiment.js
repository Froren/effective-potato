var 
	app = require('express')(),
	io = require('socket.io').listen(app.listen(3000)),
	hbs = require('hbs'),
	StateMachine = require('./stateMachine');

app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
app.set('views', './');

app.get('/', function(req, res) {
	res.render('revolvingServerExperiment.html');
});



io.on('connection', function(socket) {
	var stateMachine = new StateMachine();

	stateMachine.on("output", function(data) {
		socket.emit('m', data);
	});

	stateMachine.emit("start");

	var i = 0;
	//setInterval(function(){socket.emit('m', i++)}, 2000);

	socket.on('a', function(data) {
		stateMachine.emit("input");
		console.log(data);
	});
});	

