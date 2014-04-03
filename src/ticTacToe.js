function Game() {
  this.won = false;
}

function Board(el){
  this.$el = el;
  this.playerMarker = "";
  var self = this;

  this.$el.find("td").click(function(){
    var row = $(this).parent().parent().children().index($(this).parent());
    var col = $(this).parent().children().index($(this));
    self.setMarker(row, col, self.playerMarker);
  });
}

Board.prototype.setMarker = function(row, col, marker){
  if(this.$el.find("tr:eq(" +row+ ") td:eq(" +col+ ")").html() === ""){
    this.$el.find("tr:eq(" +row+ ") td:eq(" +col+ ")").html(marker);
  }
}