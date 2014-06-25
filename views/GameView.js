var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  template: _.template('<button class="newgame-btn">Start New Game  <span class="glyphicon glyphicon-cog"></span></button>'),
  events: {
    'click button.newgame-btn': 'newGame'
  },
  initialize: function() {

    //Adds the player views
    this.model.eachPlayer(function(player) {
      var playerView = new PlayerView({model: player});
      this.$el.append(playerView.$el);
    }.bind(this));

    //Adds the bottom part
    this.$result = $('<p>',{className:'result'});
    this.$el.append(this.$result);
    this.$el.append(this.template(this.model.toJSON()));

    //Renders the result
    this.render();
  },
  render: function() {
    this.$result.html(this.model.getResult());
  },
  newGame: function() {
    this.model.newGame();
  }
});