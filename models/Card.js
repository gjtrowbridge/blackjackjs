//Card class
var Card = Backbone.Model.extend({
  initialize: function(suit, val) {
    var stringVal = val.toString();
    if (val === 1) {
      stringVal = 'Ace';
    } else if (val === 11) {
      stringVal = 'Jack';
    } else if (val === 12) {
      stringVal = 'Queen';
    } else if (val === 13) {
      stringVal = 'King';
    }

    this.set({
      suit: suit,
      val: val,
      numVal: Math.min(val,10),
      stringVal: stringVal,
      hidden: false
    });
  },
  isAce: function() {
    return this.get('numVal') === 1;
  },
  toString: function() {
    return this.get('stringVal') + ' of ' + this.get('suit');
  },
  isHidden: function() {
    return this.get('hidden');
  }
});