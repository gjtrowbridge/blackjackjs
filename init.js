$(document).ready(function() {
  var game;
  var player;

  var updateCards = function(player) {
    if (player.dealer) {
      var $cards = $('#dealer').find('li.card');
      $cards.eq(0).html('Hidden');
      $cards.eq(1).html(player.hand.cards[1].toString());
    } else {
      var $cards = $('#player1').find('li.card');
      for (var i=0; i<$cards.length; i++) {
        $cards.eq(i).html(player.hand.cards[i].toString());
      }
    }
  };

  $('.startGame').on('click', function(event) {
    player = new Player('Player 1');
    game = new Game(player);
    game.startGame();
    console.log(game);
    updateCards(player);
    updateCards(game.dealer);
  });
  $('.hit').on('click', function(event) {
    game.dealCard(player);
    updateCards(player);
  });
  $('.stay').on('click', function(event) {
    game.endGame();
  });
});
