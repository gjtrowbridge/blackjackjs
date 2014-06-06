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

//Chooses a random index from among the remaining cards
Deck.prototype._getRandomIndex = function() {
  return Math.floor(Math.random() * this.cards.length);
}

//Shuffles the deck (can also shuffle when some cards have been dealt already)
Deck.prototype.shuffle = function(num) {
  if (num === undefined) { 
    num = 10000;
  }
  for (var i=0; i<num; i++) {
    var ind1 = this._getRandomIndex();
    var ind2 = this._getRandomIndex();

    var temp = this.cards[ind1];
    this.cards[ind1] = this.cards[ind2];
    this.cards[ind2] = temp;
  }
}

//Removes and returns the card at the front of the deck
Deck.prototype.popFirstCard = function() {
  return this.cards.shift();
}

//Gets a random card from the deck
//This allows you to "play" without needing to shuffle
Deck.prototype.popRandomCard = function() {
  //Gets a random index
  var index = this._getRandomIndex();
  
  //Gets the card at that index
  var card = this.cards[index];

  //Removes the card from the "cards" array
  this.cards[index] = this.cards[0];
  this.cards.shift();

  //Returns chosen card
  return card;
}

//Player class
var Player = function(firstName) {
  this.firstName = firstName;
  this.hand = new Hand();
}

//Hand class
var Hand = function() {
  this.cards = [];
  this.bust = false;
  this.total = 0;
}

//Pushes a card to the hand
Hand.prototype.pushCard = function(card) {
  this.cards.push(card);
  this._updateInternalProperties();
}

//Saves the total value of the current hand
//also saves a "bust" boolean
Hand.prototype._updateInternalProperties = function() {
  this.total = 0;
  var aces = 0;

  //Counts up combined value of all cards
  for (var i=0; i<this.cards.length; i++) {
    var card = this.cards[i];
    this.total += card.val;
    
    //Counts # of aces
    if (card.val === 1) {
      aces = 0;
    }
  }

  //Changes ace values to 11 when appropriate
  while ((this.total + 10 <= 21)&&(aces > 0)) {
    aces--;
    this.total+=10;
  }

  if (this.total > 21) {
    this.bust = true;
  } else {
    this.bust = false;
  }
}



//Game class--accepts arbitrary number of player objects
var Game = function() {
  //Creates and shuffles a new deck
  this.deck = new Deck();
  deck.shuffle();
  this.dealer = new Player('dealer');

  //Saves all players in this game (passed in as arguments)
  this.players = [];
  for (var i=0; i<arguments.length; i++) {
    var player = arguments[i];
    this.players.push(player)
  }
}

//Deals hands to all players
Game.prototype.startGame = function() {
  //Deal two cards to all players
  for (var i=1; i<=2; i++) {
    this.dealCard(this.dealer)
    this._eachPlayer(function(player) {
      this.dealCard(player);
    });
  }
}

//Calls an iterator on each player in the game
Game.prototype._eachPlayer = function(iterator) {
  for (var i=0; i<this.players.length; i++) {
    iterator.call(this, this.players[i]);
  }
}

//Handles dealer behavior before the game ends,
//then determines winners
Game.prototype.endGame = function() {
  while (this.dealer.hand.total < 17) {
    this.dealCard(this.dealer);
  }
  this._eachPlayer(function(player) {
    if (this.dealer.hand.bust) {
      console.log("Dealer is bust, " + player.firstName + " wins.");
    } else if (player.hand.bust) {
      console.log(player.firstName + " is bust, and loses to the dealer.");
    } else if (player.hand.total > this.dealer.hand.total) {
      console.log(player.firstName + " beats the dealer with a score of " + 
        player.hand.total.toString() + " vs " + this.dealer.hand.total.toString() + ".")
    } else if (player.hand.total === this.dealer.hand.total) {
      console.log(player.firstName + " ties with the dealer with a score of " +
        player.hand.total.toString() + " vs " + this.dealer.hand.total.toString() + ".")
    } else {
      console.log(player.firstName + " loses to the dealer with a score of " +
        player.hand.total.toString() + " vs " + this.dealer.hand.total.toString() + ".")
    }
  });
}

//Deals a card from the game deck to a specific player
Game.prototype.dealCard = function(player) {
  player.hand.pushCard(this.deck.popFirstCard());
  return player.hand.total;
}

//Checks whether the given player won the game
Game.prototype.playerWon = function() {
  
}

var deck = new Deck();
deck.shuffle();
deck.inspect();
var greg = new Player('greg');
var game = new Game(greg);
game.startGame();
