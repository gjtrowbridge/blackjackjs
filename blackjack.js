//Card class
var Card = function(suit, val) {
  this.suit = suit;
  this.val = val;

  if (val === 1) {
    this.stringVal = "Ace";
  } else if (val === 11) {
    this.stringVal = "Jack";
  } else if (val === 12) {
    this.stringVal = "Queen";
  } else if (val === 13) {
    this.stringVal = "King";
  } else {
    this.stringVal = val.toString();
  }
}

//Converts the card to a human-readable string
Card.prototype.toString = function() {
  return this.stringVal + ' of ' + this.suit;
}

//Deck Class
var Deck = function() {
  this.initialize();
}

//Logs all cards in the deck
Deck.prototype.inspect = function() {
  for (var i = 0; i < this.cards.length; i++) {
    var card = console.log(this.cards.toString());
  }
}

//Creates a new deck in order
Deck.prototype.initialize = function() {
  this.cards = [];
  var suit = "Hearts";
  for (var i=0; i<52; i++) {
    var val = (i % 13) + 1;
    if (i === 13) {
      suit = "Diamonds";
    } else if (i === 26) {
      suit = "Spades";
    } else if (i === 39) {
      suit = "Clubs";
    }
    this.cards.push(new Card(suit, val));
  }
}

//Shuffles the deck
Deck.prototype.shuffle = function(num) {
  var getRandomIndex = function() {
    return Math.floor(Math.random() * 52);
  }
  if (num === undefined) { 
    num = 10000;
  }
  for (var i=0; i<num; i++) {
    var ind1 = getRandomIndex();
    var ind2 = getRandomIndex();

    var temp = this.cards[ind1];
    this.cards[ind1] = this.cards[ind2];
    this.cards[ind2] = temp;
  }
}

//Player class
var Player = function(firstName) {
  this.firstName = firstName;
  this.hand = new Hand();
}

//Hand class
var Hand = function() {
  this.cards = [];
}

//Gets the total value of the current hand
Hand.prototype.getTotal = function() {
  var total = 0;
  for (var i=0; i<this.cards.length; i++) {
    var card = this.cards[i];
    total += card;
  }
  return total;
}

//Game class--accepts arbitrary number of player objects
var Game = function() {
  this.deck = new Deck();
  this.players = [];
  for (var i=0; i<arguments.length; i++) {
    var player = arguments[i];
    this.players.push(player)
  }
}

var deck = new Deck();
deck.shuffle();
deck.inspect();
var greg = new Player('greg');
var dealer = new Player('dealer');
