$(document).ready(function() {

  //Runs immediately
  window.game = new Game();

  window.card = new Card('Hearts', 4);
  window.cardView = new CardView({model: card});
  window.hand = new Hand();
  window.handView = new HandView({model: hand});
  window.game = new Game();
  window.gameView = new GameView({model: game});

  $('#container').append(window.gameView.$el);

});
  // //updates the cards html
  // var updateGameHtml = function() {
  //   clearAll();
  //   outputCards();
  //   outputResults();
  // };

  // //updates the html to reflect the current game progress
  // var outputResults = function() {
  //   var $results = $('#results').find('p').html('');
  //   $results.html(window.game.summary);
  // };

  // //Clears the cards html
  // var clearAll = function() {
  //   $('#dealer').find('ul.hand').html('');
  //   $('#player1').find('ul.hand').html('');
  //   $('#results').find('p').html('');
  // };
  // var outputCards = function() {

  //   //Outputs cards for each player in the game
  //   for (var i=0; i<window.game.players.length; i++) {
  //     var player = window.game.players[i];

  //     //Finds the output list
  //     var $cardsList = $('#' + player.firstName).find('ul.hand');
  //     console.log($cardsList);

  //     //Deals cards to the appropriate location
  //     for (var j=0; j<player.hand.get('cards').length; j++) {
  //       //The card to deal
  //       var card = player.hand.get('cards')[j];

  //       //Creates a list element to insert the card
  //       var $cardHtml = $('<li>');

  //       //Doesn't show the dealer's first card until the game is over
  //       if (player.dealer && !window.game.gameOver && j===0) {
  //         $cardHtml.html('hidden')
  //         $cardsList.append($cardHtml);
  //       //Otherwise inserts the card's suit and value to the element
  //       } else {
  //         $cardHtml.html(card.toString());
  //       }

  //       //Display the card element
  //       $cardsList.append($cardHtml);
  //     }
  //   }
  // };
  // //Creates the game and deals down cards
  // $('.startGame').on('click', function(event) {
  //   window.game = new Game(1);
  //   window.game.startGame();
  //   updateGameHtml();
  // });

  // //Deals a card to the player
  // $('.hit').on('click', function(event) {
  //   //The first player has index 0
  //   window.game.dealCard();

  //   //Updates the game
  //   updateGameHtml();
  // });

  // //Outputs the end-of-game results
  // $('.stay').on('click', function(event) {
  //   window.game.endGame();

  //   updateGameHtml();
  // });
