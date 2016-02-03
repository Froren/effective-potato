var write = function(msg) {process.stdout.write(`${msg}\n`);};
//^ I found that notation from the nodejs site, wtf?
var hand = require('./hoyle/hand');
var hand2 = require('./hoyle').Hand;

write("hello");

write(hand);
write(hand2);