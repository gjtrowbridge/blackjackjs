var CardView = Backbone.View.extend({
  tagName: 'span',
  className: 'card',
  template: _.template('<img src="cards/<%= val.toString() %>_<%= suit.toLowerCase() %>.png" />'),
  initialize: function() {
    //this.model.on('change', _.bind(this.render, this));
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
    this.model.on('change', _.bind(this.render, this));
  }
});

var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  template: _.template('This is a game!'),
  initialize: function() {
    this.model.on('change', _.bind(this.render, this));
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
  }
});