var CardView = Backbone.View.extend({
  tagName: 'span',
  className: 'card',
  template: _.template('<img class="card" src="<%= source %>" />'),
  initialize: function() {
    this.model.on('change', this.render, this);
    this.model.on('remove', function() {
      this.$el.html('');
    }, this);
    this.model.on('add', this.render, this);
    this.render();
  },
  render: function() {
    var attributes = this.model.toJSON();
    return this.$el.html(this.template({source: this.getSource()}));
  },
  getSource: function() {
    if (this.model.isHidden()) {
      return 'cards/playing-card-back.jpg';
    } else {
      return 'cards/' + this.model.get('val').toString() + '_' + this.model.get('suit').toLowerCase() + '.png';
    }
  }
});
var HandView = Backbone.View.extend({
  tagName: 'div',
  className: 'hand',
  initialize: function() {
    //this.collection.on('change', this.render, this);
    this.collection.on('add', this.addOne, this);

    for (var i=0; i<this.collection.length; i++) {
      var card = this.collection.at(i);
      this.addOne(card);
    }

    this.render();
  },
  addOne: function(card) {
    var cardView = new CardView({ model: card });
    this.$el.append(cardView.$el)
  }
});

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
    return '<p class="total">Total: ' + this.model.getTotal() + '</p>';
    return '<p class="total">Total: ' + this.model.getTotal() + '</p>';
  },
  playerHits: function() {
    this.model.hitMe();
    this.render();
  },
  playerStays: function() {
    this.model.stay();
  }

});

var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  template: _.template('<button class="newgame-btn">Start New Game  <span class="glyphicon glyphicon-cog"></span></button>'),
  events: {
    'click button.newgame-btn': 'newGame'
  },
  initialize: function() {
    this.model.eachPlayer(function(player) {
      var playerView = new PlayerView({model: player});
      this.$el.append(playerView.$el);
    }.bind(this));

    this.$el.append(this.template(this.model.toJSON()));
    this.render();
  },
  newGame: function() {
    this.model.newGame();
  }
});