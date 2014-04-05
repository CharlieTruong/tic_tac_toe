$(document).ready(function(){
  var game = new Game($("#settings"), $("#board"));
});

function Game(settingsEl, boardEl) {
  this.won = false;
  this.$settings = settingsEl;
  this.board = new Board(boardEl);
  this.playerMarker;
  this.playerTurn;
  this.cpu;
  var self = this;

  this.board.$el.find("td").click(function(){
    var row = $(this).parent().parent().children().index($(this).parent());
    var col = $(this).parent().children().index($(this));
    self.board.setMarker(row, col, self.playerMarker);
  });

  this.$settings.submit(function(e){
    e.preventDefault();
    if($("input:checked").length === 0){
      alert("All settings need to be checked first before the game begins.");
    }
    else{
      self.board.clearMarkers();
      self.playerMarker = $("input[name='marker']:checked").val();
      self.playerTurn = $("input[name='turn']:checked").val();
      self.cpu = new CPU(self.playerMarker);
    }
  });
}

function CPU(playerMarker){
  this.marker = playerMarker === 'X' ? 'O' : 'X';
}

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
        winner = true;
        break;
      }
    }
    return winner;
  }

  var checkVertical = function(self){
    var winner = false;
    for(var col=0; col<3; col++){
      if(cell(self, 0, col).html() === cell(self, 1, col).html() && cell(self, 1, col).html() === cell(self, 2, col).html()){
        winner = true;
        break;
      }
    }
    return winner;
  }

  var checkDiagonals = function(self){
    return (cell(self, 0, 0).html() === cell(self, 1, 1).html() && cell(self, 1, 1).html() === cell(self, 2, 2).html()) ||
           (cell(self, 0, 2).html() === cell(self, 1, 1).html() && cell(self, 1, 1).html() === cell(self, 2, 0).html());
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
    }
  };
})();

