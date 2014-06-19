

var app = {};

app.game = new Game();

app.gameView = new GameView({model: app.game});

$(function() {
  $('#container').append(app.gameView.$el);
  //app.game.newGame();
});

