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
  if(this.playerTurn === 'last'){this.cpuMove();}
  this.board.$el.find("td").click(function(){
    self.playerMove(this);
    self.cpuMove();
  });
}

Game.prototype.playerMove = function(target){
  var row = $(target).parent().parent().children().index($(target).parent());
  var col = $(target).parent().children().index($(target));
  this.board.setMarker(row, col, this.playerMarker);
  this.checkGameOver();
}

Game.prototype.cpuMove = function(){
  var self = this;
  setTimeout(function(){
    if(self.won === false && self.board.spaceRemaining() > 0){
      var move = self.cpu.nextMove(self.board, self);
      self.board.setMarker(move.row, move.col, self.cpu.marker);
      self.checkGameOver();
    }
  }, 500);
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
  else if(this.board.spaceRemaining() === 0){
   alert("It's a tie!");
   this.board.$el.find("td").unbind("click"); 
  }
}

function CPU(playerMarker){
  this.playerMarker = playerMarker;
  this.marker = playerMarker === 'X' ? 'O' : 'X';
}

CPU.prototype = (function(){
  var cornerTaken = function(self, board){
    return board.getCell(0,0) === self.playerMarker || board.getCell(2,0) === self.playerMarker || 
           board.getCell(0,2) === self.playerMarker || board.getCell(2,2) === self.playerMarker
  }

  var winAssess = function(marker, board){
    var assessment = {possible: false};
    var possibilities = board.emptySpaces();
    for (var i=0; i < possibilities.length; i++){
      var newBoard = new Board(board.$el.clone());
      newBoard.setMarker(possibilities[i].row, possibilities[i].col, marker);
      if(marker === newBoard.checkWinner()){
        assessment = {possible: true, row: possibilities[i].row, col: possibilities[i].col};
        break;
      }
    }
    return assessment;
  }

  var winPossibleCount = function(marker, board){
    var count = 0;
    var possibilities = board.emptySpaces();
    for (var i=0; i < possibilities.length; i++){
      var newBoard = new Board(board.$el.clone());
      newBoard.setMarker(possibilities[i].row, possibilities[i].col, marker);
      if(marker === newBoard.checkWinner()){
        count++;
      }
    }
    return count;
  }

  var forkAssess = function(marker, board){
    var assessment = {possible: false};
    var possibilities = board.emptySpaces();
    for (var i=0; i < possibilities.length; i++){
      var newBoard = new Board(board.$el.clone());
      newBoard.setMarker(possibilities[i].row, possibilities[i].col, marker);
      if(winPossibleCount(marker, newBoard) === 2){
        assessment = {possible: true, row: possibilities[i].row, col: possibilities[i].col};
        break;
      }
    }
    return assessment;
  }

  var blockForkAssess = function(self, board){
    var assessment = {possible: false};
    if (forkAssess(self.playerMarker, board).possible){
      var possibilities = board.emptySpaces();
      for (var i=0; i < possibilities.length; i++){
        var newBoard = new Board(board.$el.clone());
        newBoard.setMarker(possibilities[i].row, possibilities[i].col, self.marker);
        if(winAssess(self.marker, newBoard) != forkAssess(self.playerMarker, newBoard)){
          assessment = {possible: true, row: possibilities[i].row, col: possibilities[i].col};
          break;
        }
      } 
    }
    return assessment;
  }

  return {
    constructor: CPU,

    nextMove: function(board, game){
      var move = {};
      var win = winAssess(this.marker, board);
      var block = winAssess(this.playerMarker, board);
      var fork = forkAssess(this.marker, board);
      var blockFork = blockForkAssess(this, board); 

      if(win.possible){
        move = {row: win.row, col: win.col};
      }
      else if(block.possible){
        move = {row: block.row, col: block.col}; 
      }
      else if(fork.possible){
       move = {row: fork.row, col: fork.col};  
      }
      else if(blockFork.possible){
        move = {row: blockFork.row, col: blockFork.col}
      }
      else if(board.spaceRemaining() === 9){
        move = {row: 0, col: 0};
      }
      else if(board.spaceRemaining() === 8 && cornerTaken(this, board)){
        move = {row: 1, col: 1};
      }
      return move;
    }
  };


})();


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

