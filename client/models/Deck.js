var Deck = Backbone.Collection.extend({
  model: Card,
  //Creates and stores a new deck
  initialize: function() {
    this.fillWithCards();
    this.on('reset', this.fillWithCards, this);
  },
  //Logs all cards in the deck
  inspect: function() {
    this.forEach(function(card) {
      console.log(card.toString());
    });
  },
  fillWithCards: function() {
    var suit = "Hearts";
    for (var i=0; i<52; i++) {
      var val = (i % 13) + 1;
      if (i === 13) {
        suit = "Diamonds";
      } else if (i === 26) {
        suit = "Spades";
      } else if (i === 39) {
        suit = "Clubs";
      }
      this.add(new Card(suit, val));
    }
  },
  //Chooses a random index from among the remaining cards
  //Should be named to indicate that it's private, but Backbone 
  //doesn't allow this naming (apparently) and I didn't feel like
  //writing out a closure to make it truly private
  getRandomIndex: function() {
    return Math.floor(Math.random() * this.length);
  },
  //Gets a random card from the deck
  //This allows you to "play" without needing to shuffle
  popRandomCard: function() {
    //Gets a random index
    var index = this.getRandomIndex();

    //Returns the card at that index AND removes it from the collection
    var card = this.at(index);
    this.remove(card);
    return card;
  }
});