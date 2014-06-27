var GameView = Backbone.View.extend({
  tagname: 'div',
  className: 'game',
  template: _.template('<button class="newgame-btn">Start New Game  <span class="glyphicon glyphicon-cog"></span></button>'),
  events: {
    'click button.newgame-btn': 'newGame'
  },
  initialize: function() {
    this.$result = $('<div>',{class:'results'});
    this.$el.append(this.$result);

    //Adds the player views
    this.model.eachPlayer(function(player) {
      var playerView = new PlayerView({model: player});
      this.$el.append(playerView.$el);
    }.bind(this));

    //Adds the bottom part
    this.$el.append(this.template(this.model.toJSON()));

    // this.model.on('gameOver', this.render, this);
    // this.model.on('newGame', this.render, this);
    this.model.on('change:gameOver', this.render, this);

    //Renders the result
    this.render();
  },
  render: function() {
    var results = this.model.getResults();
    var html = '';
    for (var i=0; i<results.length; i++) {
      html += '<p>' + results[i] + '</p>';
    }
    this.$result.html(html);
    console.log('rendered');
  },
  newGame: function() {
    this.model.newGame();
  }
});