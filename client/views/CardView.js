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