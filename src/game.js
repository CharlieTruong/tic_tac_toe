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
  this.won = false;
  this.playerMarker = this.$settings.find("input[name='marker']:checked").val();
  this.playerTurn = this.$settings.find("input[name='turn']:checked").val();
  this.cpu = new CPU(this.playerMarker);
  this.gameLoop();
}

Game.prototype.gameLoop = function(){
  var self = this;
  if(this.playerTurn === 'last'){this.cpuMove(); console.log("moving");}
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
  if(self.won === false && self.board.spaceRemaining() > 0){
    var move = self.cpu.nextMove(self.board, self);
    self.board.setMarker(move.row, move.col, self.cpu.marker);
    self.checkGameOver();
  }
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
