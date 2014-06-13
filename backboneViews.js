var CardView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change')
  },
  render: function() {
    var html = '<p>' + this.model.toString() + '</p>';
    $(this.el).html(html);
  }
});
