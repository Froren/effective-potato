// Generated by CoffeeScript 1.3.3
(function() {
  var NoLimit, Player, assert;

  assert = require('assert');

  NoLimit = require('../betting/no_limit')(10, 20);

  Player = require('../player').Player;

  describe("No limit betting", function() {
    describe("Handle checks", function() {
      beforeEach(function() {
        var n, _i;
        this.players = [];
        for (n = _i = 0; _i <= 3; n = ++_i) {
          this.players.push(new Player({}, 1000, n));
        }
        return this.noLimit = new NoLimit(this.players, 'flop');
      });
      it("should advance the nextPlayer after a check", function() {
        this.noLimit.bet(0, 0);
        assert.equal(this.noLimit.nextToAct, this.players[1]);
        assert.equal(this.noLimit.minToRaise, 10);
        return assert.equal(this.noLimit.minToCall, 0);
      });
      return it("end a checked round", function() {
        this.noLimit.bet(0, 0);
        this.noLimit.bet(0, 1);
        this.noLimit.bet(0, 2);
        this.noLimit.bet(0, 3);
        assert.equal(this.noLimit.nextToAct, null);
        assert.equal(this.noLimit.minToRaise, 10);
        return assert.equal(this.noLimit.minToCall, 0);
      });
    });
    describe("Determining minimum raise", function() {
      beforeEach(function() {
        var n, _i;
        this.players = [];
        for (n = _i = 0; _i <= 3; n = ++_i) {
          this.players.push(new Player({}, 1000, n));
        }
        return this.noLimit = new NoLimit(this.players, 'flop');
      });
      it("should start betting with the right call amount", function() {
        assert.equal(this.noLimit.minToRaise, 10);
        return assert.equal(this.noLimit.minToCall, 0);
      });
      it("should include the previous call in calc", function() {
        this.noLimit.bet(10, 0);
        this.noLimit.bet(50, 1);
        assert.equal(this.noLimit.minToRaise, 90, "Should raise by 40");
        assert.equal(this.noLimit.minToCall, 50);
        this.noLimit.bet(90, 2);
        assert.equal(this.noLimit.minToRaise, 130);
        return assert.equal(this.noLimit.minToCall, 90);
      });
      it("not count partial(all-in) raises", function() {
        this.players[2].chips = 60;
        this.noLimit.bet(10, 0);
        this.noLimit.bet(50, 1);
        this.noLimit.bet(60, 2);
        assert.equal(this.noLimit.minToRaise, 100);
        assert.equal(this.noLimit.minToCall, 60);
        return assert.equal(this.noLimit.nextToAct, this.players[3]);
      });
      return it("count full(all-in) raises", function() {
        this.players[2].chips = 60;
        this.players[3].chips = 110;
        this.noLimit.bet(10, 0);
        this.noLimit.bet(50, 1);
        this.noLimit.bet(60, 2);
        this.noLimit.bet(110, 3);
        assert.equal(this.noLimit.nextToAct, this.players[0]);
        assert.equal(this.noLimit.minToRaise, 160);
        return assert.equal(this.noLimit.minToCall, 110);
      });
    });
    describe("Re-raises", function() {
      beforeEach(function() {
        var n, _i;
        this.players = [];
        for (n = _i = 0; _i <= 3; n = ++_i) {
          this.players.push(new Player({}, 1000, n));
        }
        return this.noLimit = new NoLimit(this.players, 'flop');
      });
      it("should not happen normally", function() {
        this.noLimit.bet(10, 0);
        this.noLimit.bet(50, 1);
        this.noLimit.bet(50, 2);
        this.noLimit.bet(50, 3);
        this.noLimit.bet(40, 0);
        return assert.equal(this.noLimit.player, null);
      });
      return it("should only allow call of incomplete raise", function() {
        this.players[3].chips = 80;
        this.noLimit.bet(10, 0);
        this.noLimit.bet(50, 1);
        this.noLimit.bet(50, 2);
        this.noLimit.bet(80, 3);
        this.noLimit.bet(70, 0);
        assert.equal(this.noLimit.minToCall, 80);
        assert.equal(this.noLimit.nextToAct, this.players[1]);
        assert.ok(!this.noLimit.canRaise);
        this.noLimit.bet(30, 1);
        assert.equal(this.noLimit.nextToAct, this.players[2]);
        this.noLimit.bet(30, 2);
        return assert.equal(this.noLimit.nextToAct, null);
      });
    });
    describe("during the pre-flop", function() {
      beforeEach(function() {
        var n, _i;
        this.players = [];
        for (n = _i = 0; _i <= 3; n = ++_i) {
          this.players.push(new Player({}, 1000, n));
        }
        this.noLimit = new NoLimit(this.players, 'pre-flop');
        return this.noLimit.takeBlinds();
      });
      it("should start with players after blinds", function() {
        assert.equal(this.noLimit.nextToAct, this.players[2]);
        return assert.equal(this.noLimit.minToCall, 10);
      });
      it("should handle blinds on option/check", function() {
        this.noLimit.bet(10, 2);
        this.noLimit.bet(10, 3);
        assert.equal(this.noLimit.nextToAct, this.players[0]);
        return assert.equal(this.noLimit.minToCall, 10);
      });
      it("should handle blinds raising", function() {
        this.noLimit.bet(10, 2);
        this.noLimit.bet(10, 3);
        this.noLimit.bet(5, 0);
        this.noLimit.bet(10, 1);
        assert.equal(this.noLimit.minToCall, 20);
        assert.equal(this.noLimit.nextToAct, this.players[2]);
        this.noLimit.bet(10, 2);
        assert.equal(this.noLimit.minToCall, 20);
        assert.equal(this.noLimit.nextToAct, this.players[3]);
        this.noLimit.bet(10, 3);
        assert.equal(this.noLimit.minToCall, 20);
        assert.equal(this.noLimit.nextToAct, this.players[0]);
        this.noLimit.bet(10, 0);
        return assert.equal(this.noLimit.nextToAct, null);
      });
      it("should handle folds", function() {
        this.noLimit.bet(0, 2);
        this.noLimit.bet(10, 3);
        this.noLimit.bet(5, 0);
        this.noLimit.bet(10, 1);
        assert.equal(this.noLimit.minToCall, 20);
        return assert.equal(this.noLimit.nextToAct, this.players[3]);
      });
      return it("should handle everyone folding", function() {
        this.noLimit.bet(0, 2);
        this.noLimit.bet(0, 3);
        this.noLimit.bet(0, 0);
        return assert.equal(this.noLimit.nextToAct, null);
      });
    });
    describe("after the pre-flop", function() {
      beforeEach(function() {
        var n, _i;
        this.players = [];
        for (n = _i = 0; _i <= 3; n = ++_i) {
          this.players.push(new Player({}, 1000, n));
        }
        new NoLimit(this.players, 'pre-flop').takeBlinds();
        return this.noLimit = new NoLimit(this.players, 'flop');
      });
      return it("should handle folds", function() {
        this.players[0].state = 'folded';
        this.noLimit.analyze();
        return assert.equal(this.noLimit.nextToAct, this.players[1]);
      });
    });
    describe("heads up", function() {
      describe("during the pre-flop", function() {
        beforeEach(function() {
          var n, _i;
          this.players = [];
          for (n = _i = 0; _i <= 1; n = ++_i) {
            this.players.push(new Player({}, 1000, n));
          }
          this.noLimit = new NoLimit(this.players, 'pre-flop');
          return this.noLimit.takeBlinds();
        });
        it("should take small blind from the button", function() {
          return assert.equal(this.players[1].blind, 5);
        });
        return it("should start with the button/dealer", function() {
          assert.equal(this.noLimit.nextToAct, this.players[1]);
          return assert.equal(this.noLimit.minToCall, 10);
        });
      });
      return describe("outside the pre-flop", function() {
        beforeEach(function() {
          var n, _i;
          this.players = [];
          for (n = _i = 0; _i <= 1; n = ++_i) {
            this.players.push(new Player({}, 1000, n));
          }
          return this.noLimit = new NoLimit(this.players, 'flop');
        });
        return it("should start with the first player", function() {
          assert.equal(this.noLimit.nextToAct, this.players[0]);
          return assert.equal(this.noLimit.minToCall, 0);
        });
      });
    });
    return describe("handling errors", function() {
      beforeEach(function() {
        var n, _i;
        this.players = [];
        for (n = _i = 0; _i <= 1; n = ++_i) {
          this.players.push(new Player({}, 1000, n));
        }
        return this.noLimit = new NoLimit(this.players, 'pre-flop');
      });
      return it("should record the error on the action", function() {
        this.noLimit.bet(0, 0, "Syntax error");
        return assert.equal('Syntax error', this.players[0].actions('pre-flop')[0].error);
      });
    });
  });

}).call(this);
