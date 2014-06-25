var Player = Backbone.Model.extend({
  initialize: function(firstName) {
    this.set({
      firstName: firstName,
      hand: new Hand(),
      dealer: false,
    });
    this.get('hand').on('change', function(){
      this.trigger('change', this);
    }, this);
    this.get('hand').on('add', function(){
      this.trigger('change', this);
    }, this);
    this.get('hand').on('remove', function(){
      this.trigger('change', this);
    }, this);
  },
  hand: function() {
    return this.get('hand');
  },
  clearHand: function() {
    this.get('hand').discard();
  },
  isDealer: function() {
    return this.get('dealer');
  },
  hitMe: function() {
    this.trigger('hitMe', this);
  },
  stay: function() {
    this.trigger('stay', this);
  },
  getTotal: function() {
    return this.get('hand').getTotal();
  },
});