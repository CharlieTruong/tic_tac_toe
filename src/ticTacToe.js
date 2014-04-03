function Game() {
  this.won = false;
}

function Board(el){
  this.$el = el;
}

Board.prototype.setMarker = function(row, col, marker){
  if(this.$el.find("tr:eq(" +row+ ") td:eq(" +col+ ")").html() === ""){
    this.$el.find("tr:eq(" +row+ ") td:eq(" +col+ ")").html(marker);
  }
}

