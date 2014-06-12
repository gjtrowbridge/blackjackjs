//Card class
var Card = Backbone.Model.extend({
  initialize: function(suit, val) {
    this.set({'suit': suit});
    this.set({'val': val});
    this.set({'numVal': Math.min(val, 10)});

    if (val === 1) {
      this.set({'stringVal':'Ace'});
    } else if (val === 11) {
      this.set({'stringVal':'Jack'});
    } else if (val === 12) {
      this.set({'stringVal':'Queen'});
    } else if (val === 13) {
      this.set({'stringVal':'King'});
    } else {
      this.set({'stringVal':val.toString()});
    }
  },
  toString: function() {
    return this.get('stringVal') + ' of ' + this.get('suit');
  }
});

var Deck = Backbone.Model.extend({
  //Creates and stores a new deck
  initialize: function() {
    this.set({'cards':[]});
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
      this.get('cards').push(new Card(suit, val));
    }
  },
  //Logs all cards in the deck
  inspect: function() {
    for (var i=0; i < this.get('cards').length; i++) {
      console.log(this.get('cards').toString());
    }
  },
  //Chooses a random index from among the remaining cards
  //Should be named to indicate that it's private, but Backbone 
  //doesn't allow this naming (apparently) and I didn't feel like
  //writing out a closure to make it truly private
  getRandomIndex: function() {
    return Math.floor(Math.random() * this.get('cards').length);
  },
  //Gets a random card from the deck
  //This allows you to "play" without needing to shuffle
  popRandomCard: function() {
    //Gets a random index
    var index = this.getRandomIndex();

    //Returns the card at that index AND removes it from the array
    return this.get('cards').splice(index,1)[0];
  },

  //The two functions below are still available, but neither are
  //necessary if you're using popRandomCard()

  //Shuffles the deck (can also shuffle when some cards have been dealt already)
  shuffle: function(num) {
    if (num === undefined) {
      num = 10000;
    }
    for (var i=0; i<num; i++) {
      var ind1 = this.getRandomIndex();
      var ind2 = this.getRandomIndex();

      var temp = this.get('cards')[ind1];
      this.get('cards')[ind1] = this.get('cards')[ind2];
      this.get('cards')[ind2] = temp;
    }
  },
  //Removes and returns the card at the front of the deck
  popFirstCard: function() {
    return this.get('cards').shift();
  }
});

var Hand = Backbone.Model.extend({
  initialize: function() {
    this.set({'cards':[]});
    this.set({'bust':false});
    this.set({'total':0});
  },
  //Pushes a card to the hand
  pushCard: function(card) {
    this.get('cards').push(card);
    this.updateInternalProperties();
  },
  //Updates "bust", "total"
  updateInternalProperties: function() {
    var aces = 0;
    var newTotal = 0;

    //Counts up combined value of all cards
    //In this inital count, aces = 1
    for (var i=0; i<this.get('cards').length; i++) {
      var card = this.get('cards')[i];
      newTotal += card.get('numVal');

      //Counts # of aces
      if (card.numVal === 1) {
        aces++;
      }
    }

    //Changes ace values to 11 where appropriate
    while ((newTotal + 10 <= 21) && (aces > 0)) {
      aces--;
      newTotal += 10;
    }

    if (newTotal > 21) {
      this.set({bust:true});
    } else {
      this.set({bust:false});
    }
    this.set({total:newTotal});
  }
});


//Player class
var Player = function(firstName) {
  this.firstName = firstName;
  this.hand = new Hand();
  this.dealer = false;
};

//Saves the total value of the current hand
//also saves a "bust" boolean
Hand.prototype._updateInternalProperties = function() {
  this.total = 0;
  
};

//Game class--accepts arbitrary number of player objects
var Game = function(numOfPlayers) {
  //Creates and shuffles a new deck
  this.deck = new Deck();
  this.deck.shuffle();
  this.gameOver = false;
  this.summary = 'Game has not started.'

  //Creates a dealer and the specified # of players
  this.players = [];

  //Creates and stores the dealer
  this.dealer = new Player('dealer');
  this.dealer.dealer = true;
  this.players.push(this.dealer);

  //Creates and stores the players
  for (var i=1; i<=numOfPlayers; i++) {
    var player = new Player('player' + i.toString());
    this.players.push(player);
  }
};

//Deals hands to all players
Game.prototype.startGame = function() {
  //Deal two cards to all players
  for (var i=1; i<=2; i++) {
    this.dealCard(this.dealer);
    this._eachPlayer(function(player) {
      this.dealCard(player);
    });
  }

  //Saves the current state of the game
  this.summary = 'Dealer shows ' + this.dealer.hand.total + '. Hit?';
};

//Calls an iterator on each player in the game
Game.prototype._eachPlayer = function(iterator) {
  for (var i=1; i<this.players.length; i++) {
    iterator.call(this, this.players[i]);
  }
};

//Handles dealer behavior before the game ends,
//then determines winners
Game.prototype.endGame = function() {
  this.gameOver = true;
  while (this.dealer.hand.total < 17) {
    this.dealCard(this.dealer);
  }
  this._eachPlayer(function(player) {
    if (player.hand.bust) {
      this.summary = player.firstName + ' is bust, and loses to the dealer.';
    } else if (this.dealer.hand.bust) {
      this.summary = 'Dealer is bust, ' + player.firstName + ' wins.';
    } else if (player.hand.total > this.dealer.hand.total) {
      this.summary = player.firstName + ' beats the dealer with a score of ' +
        player.hand.total.toString() + ' vs ' + this.dealer.hand.total.toString() + '.';
    } else if (player.hand.total === this.dealer.hand.total) {
      this.summary = player.firstName + ' ties with the dealer with a score of ' +
        player.hand.total.toString() + ' vs ' + this.dealer.hand.total.toString() + '.';
    } else {
      this.summary = player.firstName + ' loses to the dealer with a score of ' +
        player.hand.total.toString() + ' vs ' + this.dealer.hand.total.toString() + '.';
    }
  });
  console.log(this.summary);
};

//Deals a card from the game deck to a specific player
//Accepts either a player object or the index of the player
//If no arguments passed, defaults to the first player
Game.prototype.dealCard = function(player) {
  if (typeof(player) === 'number') {
    player = this.players[player];
  } else if (player === undefined) {
    player = this.players[1];
  }
  player.hand.pushCard(this.deck.popFirstCard());
  return player.hand.total;
};

//Checks whether the given player won the game
Game.prototype.playerWon = function() {

};
