// Generated by CoffeeScript 1.3.3
(function() {
  var Deck;

  require('should');

  Deck = require('../deck').Deck;

  describe("The deck", function() {
    return it("should allow for async shuffling", function(done) {
      var deck;
      deck = new Deck();
      return deck.shuffle(function() {
        return done();
      });
    });
  });

}).call(this);