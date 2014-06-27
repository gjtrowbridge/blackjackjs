var Player = Backbone.Model.extend({
  initialize: function(firstName) {
    this.set({
      firstName: firstName,
      hand: new Hand(),
      dealer: false,
      chips: 100,
      bet: 0,
      betting: true,
      result: '',
      resultKey: 'loss'
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
  clearResults: function() {
    this.set({
      result: '',
      resultKey: 'loss'
    });
  },
  unhideHand: function(overrideDealerHide) {
    var hand = this.hand();
    for (var i=0; i<hand.length; i++) {
      if (i===0 && this.get('dealer') & !overrideDealerHide) {
        //does nothing
      } else {
        hand.at(i).set('hidden', false);
      }
    }
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
  },
  hasBlackjack: function() {
    return this.hand().isBlackjack();
  },
  isBust: function() {
    return this.hand().isBust();
  },
  increaseBet: function() {
    var bet = this.get('bet');
    var chips = this.get('chips');
    if (chips > 0) {
      this.set({bet: bet+5});
      this.set({chips:chips-5});
    }
  },
  decreaseBet: function() {
    var bet = this.get('bet');
    var chips = this.get('chips');
    if (bet > 5) {
      this.set({bet: bet-5});
      this.set({chips: chips+5});
    }
  },
  resolveBetting: function() {
    var resultKey = this.get('resultKey');
    var bet = this.get('bet');
    var chips = this.get('chips');
    var winnings = 0;

    if (resultKey === 'blackjack') {
      winnings = bet * 2.5;
    } else if (resultKey === 'win') {
      winnings = bet * 2;
    } else if (resultKey === 'tie') {
      winnings = bet;
    } else {
      winnings = 0;
    }
    this.set({
      bet: 0,
      chips: chips + winnings
    });
  },
  updateResult: function(dealerTotal, dealerBlackjack) {
    var dealerBust = dealerTotal > 21;
    if (!this.get('dealer')) {

      var playerTotal = this.getTotal();
      var playerBlackjack = this.hasBlackjack();
      var playerBust = this.isBust();
      var playerName = this.get('firstName');
      
      var playerResult = '';
      var playerResultKey = '';

      if (playerBust) {
        playerResult = playerName + ' is bust, and loses.';
        playerResultKey = 'loss';
      } else if (playerBlackjack) {
        if (dealerBlackjack) {
          playerResult = 'Both dealer and ' + playerName + ' have blackjack. Draw.';
          playerResultKey = 'tie';
        } else {
          playerResult = playerName + ' has blackjack! Winner!';
          playerResultKey = 'blackjack';
        }
      } else if (dealerBlackjack) {
        playerResult = 'Dealer has a blackjack. ' + playerName + ' loses.';
        playerResultKey = 'loss';
      } else if (dealerBust) {
        playerResult = 'Dealer is bust. ' + playerName + ' wins.'
        playerResultKey = 'win';
      } else if (dealerTotal > playerTotal) {
        playerResult = 'Dealer wins with a score of ' + dealerTotal + '. ' + playerName + ' loses.';
        playerResultKey = 'loss';
      } else if (dealerTotal === playerTotal) {
        playerResult = 'Both dealer and ' + playerName + ' have a score of ' + dealerTotal + '. Draw.';
        playerResultKey = 'tie';
      } else {
        playerResult = playerName + ' wins with a score of ' + playerTotal + '.';
        playerResultKey = 'win';
      }
      this.set({
        result: playerResult,
        resultKey: playerResultKey
      });
    }
  }
});