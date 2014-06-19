var CardView = Backbone.View.extend({
  tagName: 'span',
  className: 'card',
  template: _.template('<img src="cards/<%= val.toString() %>_<%= suit.toLowerCase() %>.png" />'),
  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },
  render: function() {
    var attributes = this.model.toJSON();
    return this.$el.html(this.template(attributes));
  }
});
var HandView = Backbone.View.extend({
  tagName: 'div',
  className: 'hand',
  initialize: function() {
    this.collection.on('change', _.bind(this.render, this));
    this.collection.on('add', this.addOne, this);
    for (var i=0; i<this.collection.length; i++) {
      var card = this.collection.at(i);
      this.addOne(card);
    }
    this.render();
  },
  render: function() {
    return this.$el;
  },
  addOne: function(card) {
    var cardView = new CardView({ model: card });
    this.$el.append(cardView.$el)
  }
});

var PlayerView = Backbone.View.extend({
  tagName: 'div',
  className: 'player',
  initialize: function() {
    this.model.on('change', this.render, this);
    this.handView = new HandView({collection: this.model.hand()});
    this.render();
  },
  template: _.template('Player name is: <%= firstName %>'),
  render: function() {
    var attributes = this.model.toJSON();
    return this.$el.html([
      this.template(attributes),
      this.handView.$el
    ]);
  }

});

var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  initialize: function() {
    this.model.on('change', this.render, this);

    this.model.eachPlayer(function(player) {
      var playerView = new PlayerView({model: player});
      this.$el.append(playerView.$el);
    }.bind(this));
    
    this.render();
  },
  render: function() {
    return this.$el;
  }
});