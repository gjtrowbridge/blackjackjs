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
      stringVal: stringVal,
      hidden: false
    });
  },
  isAce: function() {
    return this.get('numVal') === 1;
  },
  toString: function() {
    return this.get('stringVal') + ' of ' + this.get('suit');
  },
  isHidden: function() {
    return this.get('hidden');
  }
});

var Deck = Backbone.Collection.extend({
  model: Card,
  //Creates and stores a new deck
  initialize: function() {
    this.fillWithCards();
    this.on('reset', this.fillWithCards, this);
  },
  //Logs all cards in the deck
  inspect: function() {
    this.forEach(function(card) {
      console.log(card.toString());
    });
  },
  fillWithCards: function() {
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
  }
});

var Hand = Backbone.Collection.extend({
  model: Card,
  inspect: function() {
    this.forEach(function(card) {
      console.log(card.toString());
    });
  },
  getTotal: function(ignoreHidden) {
    var aces = 0;
    var total = 0;
    this.forEach(function(card) {
      //Only sums up cards that are not hidden
      if (!card.get('hidden')) {
        total += card.get('numVal');
        if (card.isAce()) {
          aces++;
        }
      }
    });
    while ((total + 10 <= 21) && (aces > 0)) {
      aces--;
      total += 10;
    }
    return total;
  },
  //Can't use reset() because it doesn't fire
  //model events
  discard: function() {
    while(this.length > 0) {
      this.remove(this.at(0));
    }
  }
});

var Player = Backbone.Model.extend({
  initialize: function(firstName) {
    this.set({
      firstName: firstName,
      hand: new Hand(),
      dealer: false,
    });
    this.get('hand').on('change', function(){
      this.trigger('change', this);
    }, this);
    this.get('hand').on('add', function(){
      this.trigger('change', this);
    }, this);
    this.get('hand').on('remove', function(){
      this.trigger('change', this);
    }, this);
  },
  hand: function() {
    return this.get('hand');
  },
  clearHand: function() {
    this.get('hand').discard();
  },
  isDealer: function() {
    return this.get('dealer');
  },
  hitMe: function() {
    this.trigger('hitMe', this);
  },
  stay: function() {
    this.trigger('stay', this);
  },
  getTotal: function() {
    return this.get('hand').getTotal();
  }
});

var Game = Backbone.Model.extend({
  //Creates and saves two players and a deck,
  //then deals the initial hands
  initialize: function() {
    var player1 = new Player('player1');
    var dealer = new Player('dealer');
    dealer.set('dealer',true);
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
    for (var i=0; i<players.length; i++) {
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

    this.set({
      gameOver: false
    });

    //Resets the deck with all new cards
    this.get('deck').reset();

    //Deals initial hands
    this.dealHands();
  },
  //Deals the starting cards to each player
  dealHands: function() {
    for (var i=1; i<=2; i++) {
      this.eachPlayer(function(player) {
        if (player.isDealer() && i === 1) {
          this.dealCard(player, true);
        } else {
          this.dealCard(player, false);
        }
      })
    }
  },
  //Deals a card to the specified player
  dealCard: function(player, hidden) {
    //Only deals a card if the game is still going on
    if (!this.get('gameOver')) {
      //Handles numeric or undefined input
      if (typeof(player) === 'number') {
        player = this.players[player];
      } else if (player === undefined) {
        player = this.players[1];
      }

      //Deals a card to this player's hand
      var card = this.get('deck').popRandomCard();
      card.set({hidden:hidden});

      player.get('hand').add(card);
    }
  },
  //Deals cards to the dealer and stores the game result
  endGame: function() {

    //Deals cards to the dealer
    var dealer = this.get('dealer');
    dealer.hand().at(0).set({hidden:false});

    while (dealer.getTotal() < 17) {
      this.dealCard(dealer);
    }

    //Saves the results of the game
    this.set({
      gameOver: true,
    });
  }
});