var Game = Backbone.Model.extend({
  //Creates and saves two players and a deck,
  //then deals the initial hands
  initialize: function() {
    var dealer = new Player('dealer');
    dealer.set('dealer',true);
    var players = [dealer, new Player('Player 1')];

    //Sets up 
    this.set({
      deck: new Deck(),
      gameOver: false,
      players: players,
      dealer: dealer,
    });

    //Binds certain events to all non-dealer players
    this.eachPlayer(function(player) {
      if (!player.get('dealer')) {
        player.on('hitMe', function() {
          this.dealCard(player);
        }, this);
        player.on('stay', function() {
          this.endGame();
        }, this);
        player.on('change', function() {
          if (player.getTotal() > 21) {
            this.endGame();
          }
        }, this);
        player.on('change:betting', function() {
          this.eachPlayer(function(player) {
            player.unhideHand();
          });
        }, this);
      }
    });

    //Finishes setting up
    this.newGame();
  },
  //Loops over each player in the game and passes
  //each as an argument to the given iterator

  //Probably not necessary, as this implementation
  //currently has only one non-dealer player...
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
      player.clearBets();
      player.clearResults();
      player.set('betting', true)
    });
    
    this.set({
      gameOver: false,
    });

    //Resets the deck with all new cards
    this.get('deck').reset();

    //Deals initial hands
    this.dealHands();

    this.eachPlayer(function(player) {
      console.log(player.get('firstName'));
      player.hand().inspect();
    });

    // this.trigger('newGame');
    
  },
  startGame: function() {
    //unhide hands
    this.eachPlayer(function(player) {
      player.unhideHand(false);
    });

  },
  //Deals the starting cards to each player
  dealHands: function() {
    for (var i=1; i<=2; i++) {
      this.eachPlayer(function(player) {
        this.dealCard(player, true);
      });
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

      player.hand().add(card);
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

    //Calculates the result for each player
    var dealerTotal = dealer.getTotal();
    var dealerBlackjack = dealer.hasBlackjack();
    this.eachPlayer(function(player) {
      player.updateResult(dealerTotal,dealerBlackjack);
    });

    //Saves the results of the game
    this.set({
      gameOver: true,
    });
  },
  getResults: function() {
    if (this.get('gameOver')) {

      var results = [];
      this.eachPlayer(function(player) {
        if (!player.get('dealer')) {
          results.push(player.get('result'));
        }
      });
      return results;
    } else {
      return [];
    }
  }
});