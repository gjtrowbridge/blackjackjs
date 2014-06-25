var PlayerView = Backbone.View.extend({
  tagName: 'div',
  className: 'player',
  events: {
    'click button.hit-btn': 'playerHits',
    'click button.stay-btn': 'playerStays',
    'click button.bet-up': 'playerIncreasesBet',
    'click button.bet-down': 'playerDecreasesBet'
  },
  initialize: function() {
    this.model.on('change', this.render, this);
    this.model.on('remove', this.remove, this);
    this.handView = new HandView({collection: this.model.hand()});
    this.render();
  },
  template: _.template('<h1 class="name"><%= firstName.toUpperCase() %></h1>'),
  render: function() {
    var attributes = this.model.toJSON();
    return this.$el.html([
      this.template(attributes),
      this.handView.$el,
      this.renderTotals(),
      this.renderBet(),
      this.renderButtons(),
    ]);
  },
  renderBet: function() {
    if (this.model.isDealer()) {
      return '';
    } else {
      return  '<div class="bet"><p><span>Current Bet: $' + this.model.get('bet') + '</span>' +
              ' | <span>You have: $' + this.model.get('chips') + '</span></p></div>' +
              '<button class="bet bet-down">Decrease Bet <span class="glyphicon glyphicon-minus"></span></button>' +
              '<button class="bet bet-up">Increase Bet <span class="glyphicon glyphicon-plus"></span></button>';
    }
  },
  renderButtons: function() {
    if (this.model.isDealer()) {
      return '';
    } else {
      return '<div><button class="hit-btn">Hit Me! <span class="glyphicon glyphicon-play"></span></button><button class="stay-btn">Stay  <span class="glyphicon glyphicon-stop"></span></button></div>';
    }
  },
  renderTotals: function() {
    var total = this.model.getTotal();
    if (total > 21) {
      return '<p class="total">Total: ' + this.model.getTotal() + ' (Bust)</p>';
    } else if (this.model.hasBlackjack()) {
      return '<p class="total">Blackjack!</p>';
    } else {
      return '<p class="total">Total: ' + this.model.getTotal() + '</p>';
    }
  },
  playerHits: function() {
    this.model.hitMe();
    this.render();
  },
  playerStays: function() {
    this.model.stay();
  },
  playerIncreasesBet: function() {
    this.model.increaseBet();
    console.log(this.model.get('bet'));
    this.render();
  },
  playerDecreasesBet: function() {
    this.model.decreaseBet();
    this.render();
  }
});