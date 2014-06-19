

var app = {};

app.game = new Game();

app.card = new Card('Hearts', 6);
app.cardView = new CardView({model: app.card});

app.hand = new Hand();
app.handView = new HandView({collection: app.hand});


app.game = new Game();
app.gameView = new GameView({model: app.game});

$(function() {
  $('#container').append(app.handView.$el);
});

