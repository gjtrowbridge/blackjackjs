var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  template: _.template('<button class="newgame-btn">Start New Game  <span class="glyphicon glyphicon-cog"></span></button>'),
  events: {
    'click button.newgame-btn': 'newGame'
  },
  initialize: function() {
    this.$result = $('<p>',{className:'result'});
    this.$el.append(this.$result);

    //Adds the player views
    this.model.eachPlayer(function(player) {
      var playerView = new PlayerView({model: player});
      this.$el.append(playerView.$el);
    }.bind(this));

    //Adds the bottom part
    this.$el.append(this.template(this.model.toJSON()));

    this.model.on('gameOver', this.render, this);
    this.model.on('newGame', this.render, this);

    //Renders the result
    this.render();
  },
  render: function() {
    var results = this.model.getResults();
    var html = '<div class="results">';
    for (var i=0; i<results.length; i++) {
      html += '<p>' + results[i] + '</p>';
    }
    html += '</div>'
    this.$result.html(html);
  },
  newGame: function() {
    this.model.newGame();
  }
});