function CPU(playerMarker){
  this.playerMarker = playerMarker;
  this.marker = playerMarker === 'X' ? 'O' : 'X';
}

CPU.prototype = (function(){

  //private

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
        if(winAssess(self.marker, newBoard).possible === true && forkAssess(self.playerMarker, newBoard).possible === false){
          assessment = {possible: true, row: possibilities[i].row, col: possibilities[i].col};
          break;
        }
      } 
    }
    return assessment;
  }

  var oppositeCorner = function(self, board){
    var corners = [{row: 0, col: 0}, {row: 0, col: 2}, {row: 2, col: 0}, {row: 2, col: 2}];
    var opposite = [{row: 2, col: 2}, {row: 2, col: 0}, {row: 0, col: 2}, {row: 0, col: 0}];
    var assessment = {possible: false};
    for(var i=0; i < corners.length; i++){
      if(board.getCell(corners[i].row, corners[i].col) === self.playerMarker &&  board.getCell(opposite[i].row, opposite[i].col) === ""){
        assessment = {possible: true, row: opposite[i].row, col: opposite[i].col};
        break;
      }
    }
    return assessment;
  }

  var anyCorner = function(self, board){
    var corners = [{row: 0, col: 0}, {row: 0, col: 2}, {row: 2, col: 0}, {row: 2, col: 2}];
    var assessment = {possible: false};
    for(var i=0; i < corners.length; i++){
      if(board.getCell(corners[i].row, corners[i].col) === ""){
        assessment = {possible: true, row: corners[i].row, col: corners[i].col};
        break;
      }
    }
    return assessment;
  }

  var anySide = function(self, board){
    var sides = [{row: 1, col: 0}, {row: 1, col: 2}, {row: 0, col: 1}, {row: 2, col: 1}];
    var assessment = {possible: false};
    for(var i=0; i < sides.length; i++){
      if(board.getCell(sides[i].row, sides[i].col) === ""){
        assessment = {possible: true, row: sides[i].row, col: sides[i].col};
        break;
      }
    }
    return assessment;
  }

  //public

  return {
    constructor: CPU,

    nextMove: function(board, game){
      var move = {};
      var win = winAssess(this.marker, board);
      var block = winAssess(this.playerMarker, board);
      var fork = forkAssess(this.marker, board);
      var blockFork = blockForkAssess(this, board); 
      var oppCorner = oppositeCorner(this, board);
      var corner = anyCorner(this, board);
      var side = anySide(this, board);
      
      if(board.spaceRemaining() === 9){
        move = {row: 0, col: 0};
      }
      else if(board.spaceRemaining() === 8 && cornerTaken(this, board)){
        move = {row: 1, col: 1};
      }
      else if(win.possible){
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
      else if(board.getCell(1,1) == ""){
        move = {row: 1, col: 1}; 
      }
      else if(oppCorner.possible){
        move = {row: oppCorner.row, col: oppCorner.col} 
      }
      else if(corner.possible){
        move = {row: corner.row, col: corner.col}  
      }
      else if(side.possible){
        move = {row: side.row, col: side.col}  
      }
      return move;
    }
  };
})();
