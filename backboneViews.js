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
    this.$el.html(this.template(attributes));
  }
});
var HandView = Backbone.View.extend({
  tagName: 'div',
  className: 'hand',
  template: _.template(''),
  initialize: function() {
    this.model.on('change', _.bind(this.render, this));
  },
  render: function() {
    var attributes = this.model.toJSON();
    this.$el.html(this.template(attributes));
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