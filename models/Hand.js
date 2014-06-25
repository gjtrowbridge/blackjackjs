var Hand = Backbone.Collection.extend({
  model: Card,
  inspect: function() {
    this.forEach(function(card) {
      console.log(card.toString());
    });
  },
  getTotal: function(ignoreHidden) {
    var aces = 0;
    var total = 0;
    this.forEach(function(card) {
      //Only sums up cards that are not hidden
      if (!card.get('hidden')) {
        total += card.get('numVal');
        if (card.isAce()) {
          aces++;
        }
      }
    });
    while ((total + 10 <= 21) && (aces > 0)) {
      aces--;
      total += 10;
    }
    return total;
  },
  //Can't use reset() because it doesn't fire
  //model events
  discard: function() {
    while(this.length > 0) {
      this.remove(this.at(0));
    }
  }
});