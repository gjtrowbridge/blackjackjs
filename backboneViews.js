var CardView = Backbone.View.extend({
  tagName: 'span',
  className: 'card',
  template: _.template('<img src="cards/<%= val.toString() %>_<%= suit.toLowerCase() %>.png" />'),
  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
    this.model.on('remove', function() {
      this.$el.html('');
    }, this);
    this.model.on('add', this.render, this);
  },
  render: function() {
    var attributes = this.model.toJSON();
    return this.$el.html(this.template(attributes));
  },
});
var HandView = Backbone.View.extend({
  tagName: 'div',
  className: 'hand',
  initialize: function() {
    this.collection.on('change', this.render, this);
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
  template: _.template('<h1><%= firstName.toUpperCase() %></h1>'),
  render: function() {
    var attributes = this.model.toJSON();
    return this.$el.html([
      this.template(attributes),
      this.handView.$el,
      this.renderButtons()
    ]);
  },
  renderButtons: function() {
    if (this.model.isDealer()) {
      return '';
    } else {
      return '<button class="hit-btn btn btn-default">Hit Me!</button><button class="stay-btn btn btn-default">Stay</button>';
    }
  },
  playerHits: function() {
    this.model.hitMe();
  },
  playerStays: function() {
    this.model.stay();
  }

});

var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  template: _.template('<button class="newgame-btn btn btn-default">Start New Game</button>'),
  events: {
    'click button.newgame-btn': 'newGame'
  },
  initialize: function() {
    this.model.eachPlayer(function(player) {
      var playerView = new PlayerView({model: player});

      player.on('hitMe', function(player) {
        this.model.dealCard(player);
      }, this);
      player.on('stay', function(player) {
        this.model.endGame();
      }, this);

      this.$el.append(playerView.$el);
    }.bind(this));
    this.$el.append(this.template(this.model.toJSON()));
    this.render();
  },
  newGame: function() {
    this.model.newGame();
  }
});