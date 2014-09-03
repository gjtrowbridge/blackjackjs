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
