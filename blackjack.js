//Card class
var Card = Backbone.Model.extend({
  initialize: function(suit, val) {
    var stringVal = val.toString();
    if (val === 1) {
      stringVal = 'Ace';
    } else if (val === 11) {
      stringVal = 'Jack';
    } else if (val === 12) {
      stringVal = 'Queen';
    } else if (val === 13) {
      stringVal = 'King';
    }

    this.set({
      suit: suit,
      val: val,
      numVal: Math.min(val,10),
      stringVal: stringVal
    });

  },
  toString: function() {
    return this.get('stringVal') + ' of ' + this.get('suit');
  }
});

var Deck = Backbone.Collection.extend({
  //Creates and stores a new deck
  initialize: function() {
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
      this.add(new Card(suit, val));
    }
  },
  //Logs all cards in the deck
  inspect: function() {
    this.forEach(function(card) {
      console.log(card.toString());
    });
  },
  //Chooses a random index from among the remaining cards
  //Should be named to indicate that it's private, but Backbone 
  //doesn't allow this naming (apparently) and I didn't feel like
  //writing out a closure to make it truly private
  getRandomIndex: function() {
    return Math.floor(Math.random() * this.length);
  },
  //Gets a random card from the deck
  //This allows you to "play" without needing to shuffle
  popRandomCard: function() {
    //Gets a random index
    var index = this.getRandomIndex();

    //Returns the card at that index AND removes it from the collection
    var card = this.at(index);
    this.remove(card);
    return card;
  },

  //The two functions below are still available, but neither are
  //necessary if you're using popRandomCard()

  //Shuffles the deck (can also shuffle when some cards have been dealt already)
  // shuffle: function(num) {
  //   if (num === undefined) {
  //     num = 10000;
  //   }
  //   for (var i=0; i<num; i++) {
  //     var ind1 = this.getRandomIndex();
  //     var ind2 = this.getRandomIndex();

  //     var temp = this.get('cards')[ind1];
  //     this.get('cards')[ind1] = this.get('cards')[ind2];
  //     this.get('cards')[ind2] = temp;
  //   }
  // },
  // //Removes and returns the card at the front of the deck
  // popFirstCard: function() {
  //   return this.get('cards').shift();
  // }
});

var Hand = Backbone.Model.extend({
  initialize: function() {
    this.set({
      cards: [],
      bust: false,
      total: 0
    });
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

var Player = Backbone.Model.extend({
  initialize: function(firstName) {
    this.set({
      firstName: firstName,
      hand: new Hand(),
      dealer: false
    });
  },
  clearHand: function() {
    this.set({
      hand: new Hand()
    })
  }
});

var Game = Backbone.Model.extend({
  //Creates and saves two players and a deck,
  //then deals the initial hands
  initialize: function() {
    var player1 = new Player('player1');
    var dealer = new Player('dealer');
    dealer.dealer = true;
    var players = [dealer, player1];

    this.set({
      deck: new Deck(),
      gameOver: false,
      players: players,
      dealer: dealer,
    });

    this.dealHands();
  },
  //Loops over each player in the game and passes
  //each as an argument to the given iterator
  eachPlayer: function(iterator) {
    var players = this.get('players');
    for (var i=1; i<players.length; i++) {
      iterator.call(this, players[i]);
    }
  },
  //Creates and saves a new deck,
  //clears all players' hands,
  //then deals the initial hands
  newGame: function() {
    //Clears the hand for each player
    this.eachPlayer(function(player) {
      player.clearHand();
    });

    //Creates a new deck for the new game
    this.set({
      deck: new Deck(),
      gameOver: false,
    });

    //Deals initial hands
    this.dealHands();
  },
  //Deals the starting cards to each player
  dealHands: function() {
    for (var i=1; i<=2; i++) {
      this.eachPlayer(function(player) {
        this.dealCard(player);
      })
    }
  },
  //Deals a card to the specified player
  dealCard: function(player) {
    //Handles numeric or undefined input
    if (typeof(player) === 'number') {
      player = this.players[player];
    } else if (player === undefined) {
      player = this.players[1];
    }

    //Deals a card to this player's hand
    player.get('hand').pushCard(this.get('deck').popRandomCard());
  },
  //Deals cards to the dealer and stores the game result
  endGame: function() {
    this.gameOver = true;

    //Deals cards to the dealer
    var dealer = this.get('dealer');
    while (deal.get('hand').get('total') < 17) {
      this.dealCard(dealer);
    }

    //Saves the results of the game
    this.set({
      gameOver: true,
    });
  }
});

    // this._eachPlayer(function(player) {
    //   if (player.hand.bust) {
    //     this.summary = player.firstName + ' is bust, and loses to the dealer.';
    //   } else if (this.dealer.hand.bust) {
    //     this.summary = 'Dealer is bust, ' + player.firstName + ' wins.';
    //   } else if (player.hand.total > this.dealer.hand.total) {
    //     this.summary = player.firstName + ' beats the dealer with a score of ' +
    //       player.hand.total.toString() + ' vs ' + this.dealer.hand.total.toString() + '.';
    //   } else if (player.hand.total === this.dealer.hand.total) {
    //     this.summary = player.firstName + ' ties with the dealer with a score of ' +
    //       player.hand.total.toString() + ' vs ' + this.dealer.hand.total.toString() + '.';
    //   } else {
    //     this.summary = player.firstName + ' loses to the dealer with a score of ' +
    //       player.hand.total.toString() + ' vs ' + this.dealer.hand.total.toString() + '.';
    //   }
    // });
    // console.log(this.summary);
