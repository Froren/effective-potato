module.exports = StateMachine;

var 
	EventEmitter = require('events').EventEmitter,
	util = require('util');

//Wow this line can overwrite the other methods if it comes after everything.
util.inherits(StateMachine, EventEmitter);

function StateMachine() {
	var _this = this;
	this.on("start", function() {
		_this.task1();
	});
}

StateMachine.prototype.task1 = function() {
	this.emit("output", "Task1");
	return this.task2();
}

StateMachine.prototype.task2 = function() {
	var _this = this;
	this.emit("output", "Task2.. waiting");
	return this.once("input", function() {
		_this.emit("output", "received!");
		return _this.task3();
	});
}

StateMachine.prototype.task3 = function() {
	this.emit("output", "Task3");
	return this.task4();
}

StateMachine.prototype.task4 = function() {
	var _this = this;
	this.emit("output", "Task4.. delay (5s) or input");

	var i = 0;
	var t = setInterval(function() {
		_this.emit("output", ++i);

		if (i === 5) {
			_this.emit("input");
		}
	}, 1000);

	this.once("input", function() {
		clearInterval(t);
		_this.task5();
	});
}

StateMachine.prototype.task5 = function() {
	this.emit("output", "Task5");
	return this.task1();
}




