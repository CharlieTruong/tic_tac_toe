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

  this.$settings.submit(function(e){
    e.preventDefault();
    if(self.$settings.find("input:checked").length === 0){
      alert("All settings need to be checked first before the game begins.");
    }
    else{
      self.start();
    }
  });
}

Game.prototype.start = function(){
  this.board.clearMarkers();
  this.playerMarker = this.$settings.find("input[name='marker']:checked").val();
  this.playerTurn = this.$settings.find("input[name='turn']:checked").val();
  this.cpu = new CPU(this.playerMarker);
  this.gameLoop();
}

Game.prototype.gameLoop = function(){
  var self = this;
  this.board.$el.find("td").click(function(){
    self.playerMove(this);
    self.checkGameOver();
    var move = self.cpu.nextMove(self.board);
    self.board.setMarker(move.row, move.col, self.cpu.marker);
    self.checkGameOver();
  });
}

Game.prototype.playerMove = function(target){
  var row = $(target).parent().parent().children().index($(target).parent());
  var col = $(target).parent().children().index($(target));
  this.board.setMarker(row, col, this.playerMarker);
}

Game.prototype.checkGameOver = function(){
  this.won = this.board.checkWinner();
  if(this.won === this.playerMarker){
    alert("You won!");
    this.board.$el.find("td").unbind("click");
  }
  else if(this.won === this.cpu.marker){
    alert("You lost!");
    this.board.$el.find("td").unbind("click");
  }
}

function CPU(playerMarker){
  this.marker = playerMarker === 'X' ? 'O' : 'X';
}

CPU.prototype.nextMove = function(board){
  var move = {};
  board.$el.find("td").each(function(){
    if($(this).html()===""){
      move.row = $(this).parent().parent().children().index($(this).parent());
      move.col = $(this).parent().children().index($(this));
      return false;
    }
  });
  return move;
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
    }
  };
})();

