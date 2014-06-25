var Player = Backbone.Model.extend({
  initialize: function(firstName) {
    this.set({
      firstName: firstName,
      hand: new Hand(),
      dealer: false,
      chips: 100,
      bet: 5,
      betting: true
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
  clearBets: function() {
    var chips = this.get('chips');
    if (chips > 0) {
      this.set('bet',5);
      this.set('chips', chips - 5);
    } else {
      this.set('bet', 0);
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
  }
});