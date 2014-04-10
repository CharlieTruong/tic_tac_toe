function Board(el){
  this.$el = el;
}

Board.prototype = (function(){
  //private

  var cell = function(self, row, col) {
    return self.$el.find("tr:eq(" +row+ ") td:eq(" +col+ ")");
  }

  var checkHorizontal = function(self){
    var winner = false;
    for(var row=0; row<3; row++){
      if (cell(self, row, 0).html() === cell(self, row, 1).html() && cell(self, row, 1).html() === cell(self, row, 2).html()){
        if(cell(self, row, 0).html()){
          winner = cell(self, row, 0).html();
          break;
        }
      }
    }
    return winner;
  }

  var checkVertical = function(self){
    var winner = false;
    for(var col=0; col<3; col++){
      if(cell(self, 0, col).html() === cell(self, 1, col).html() && cell(self, 1, col).html() === cell(self, 2, col).html()){
        if(cell(self, 0, col).html() != ""){
          winner = cell(self,0,col).html();
          break;
        }
      }
    }
    return winner;
  }

  var checkDiagonals = function(self){
    var winner = false;
    if (cell(self, 0, 0).html() === cell(self, 1, 1).html() && cell(self, 1, 1).html() === cell(self, 2, 2).html()){
      if(cell(self, 0, 0).html()){
        winner = cell(self, 0, 0).html();
      }
    }
    else if (cell(self, 0, 2).html() === cell(self, 1, 1).html() && cell(self, 1, 1).html() === cell(self, 2, 0).html()){
      if(cell(self, 0, 2).html()){
        winner = cell(self, 0, 2).html();
      }
    }
    return winner;
  }

  //public

  return {
    constructor: Board,

    setMarker: function(row, col, marker){
      if(cell(this, row, col).html() === ""){
        cell(this, row, col).html(marker);
      }
    },

    checkWinner: function(){
      return checkVertical(this) || checkHorizontal(this) || checkDiagonals(this);
    },

    clearMarkers: function(){
      this.$el.find("td").each(function(){
        $(this).html("");
      });
    },

    spaceRemaining: function(){
      var numSpaces = 0;
      this.$el.find("td").each(function(){
        if($(this).html() === ""){numSpaces++}
      }); 
      return numSpaces;
    },

    getCell: function(row, col){
      return cell(this, row, col).html();
    }, 

    emptySpaces: function(){
      var empty = [];
      this.$el.find("td").each(function(){
        if($(this).html() === ""){
          var row = $(this).parent().parent().children().index($(this).parent());
          var col = $(this).parent().children().index($(this));
          empty.push({row: row, col: col});
        }
      });
      return empty;
    }
  };
})();
