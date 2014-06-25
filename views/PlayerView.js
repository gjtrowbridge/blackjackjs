var PlayerView = Backbone.View.extend({
  tagName: 'div',
  className: 'player',
  events: {
    'click button.hit-btn': 'playerHits',
    'click button.stay-btn': 'playerStays'
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
      this.renderButtons(),
    ]);
  },
  renderButtons: function() {
    if (this.model.isDealer()) {
      return '';
    } else {
      return '<button class="hit-btn">Hit Me! <span class="glyphicon glyphicon-play"></span></button><button class="stay-btn">Stay  <span class="glyphicon glyphicon-stop"></span></button>';
    }
  },
  renderTotals: function() {
    var total = this.model.getTotal();
    if (total > 21) {
      return '<p class="total">Total: ' + this.model.getTotal() + ' (Bust)</p>';
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
  }

});