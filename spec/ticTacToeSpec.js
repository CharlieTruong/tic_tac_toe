describe("Game", function() {
  var game;

  beforeEach(function() {
    setUpHTMLFixture();  
    game = new Game($("#settings"), $("#board"));
  });

  it("a new game has a win status of 'false.'", function() {
    expect(game.won).toEqual(false);
  });

  it("has a 'settings' property that is the jQuery object of the element with id #settings", function(){
    expect(game.$settings).toEqual($("#settings"));
  });

  it("has a 'board' property that is an instance of Board", function(){
    expect(game.board.constructor).toEqual(Board);
  });

  describe("#clickTableCell", function(){

    beforeEach(function(){
      game.playerMarker = 'X';
      game.cpu = new CPU(game.playerMarker);
      game.gameLoop();
    });

    it("Board#setMarker is called when a table cell is clicked", function(){
      spyOn(game.board,'setMarker');
      game.board.$el.find("tr:eq(0) td:eq(0)").trigger("click");
      expect(game.board.setMarker).toHaveBeenCalled();
    });

    it("adds the player's marker to the chosen cell", function(){
      game.board.$el.find("tr:eq(2) td:eq(2)").trigger("click");
      expect(game.board.$el.find("tr:eq(2) td:eq(2)").html()).toEqual('X');
    });

    it("checks for winner after every player move", function(){
      var spy = spyOn(game,'checkGameOver');
      game.board.$el.find("tr:eq(2) td:eq(2)").trigger("click");
      expect(spy).toHaveBeenCalled();
    });

    it("calls on the cpu to move after a player move", function(){
      var spy = spyOn(game,'cpuMove');
      game.board.$el.find("tr:eq(2) td:eq(2)").trigger("click");
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("#click new game with no selections", function(){
    it("does not start a game unless a player chooses all settings", function(){
      var spy = spyOn(window,'alert');
      $("#settings input[type='submit']").trigger("click");
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("#click new game with selections", function(){

    beforeEach(function(){
      $("input[value='O']").trigger("click");
      $("input[value='first']").trigger("click");
    });

    it("clears the board", function(){
      var spy = spyOn(game.board,'clearMarkers');
      $("#settings input[type='submit']").trigger("click");
      expect(spy).toHaveBeenCalled();
    });

    it("sets the playerMarker and playerTurn based on the selection", function(){
      $("#settings input[type='submit']").trigger("click");
      expect(game.playerMarker).toEqual('O');
      expect(game.playerTurn).toEqual('first');
    });

    it("instantiates and sets the cpu in the game", function(){
      $("#settings input[type='submit']").trigger("click");
      expect(game.cpu.constructor).toEqual(CPU);
    });

    it("calls on the cpu to move first if the player chooses to go last", function(){
      $("input[value='last']").trigger("click");
      var spy = spyOn(game, 'cpuMove');
      $("#settings input[type='submit']").trigger("click");
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("#checkGameOver", function(){
    beforeEach(function(){
      game.playerMarker = 'X';
      game.cpu = {marker: 'O'};
    });

    it("declares a winner and ends the game", function(){
      game.board.setMarker(0,1,"X");
      game.board.setMarker(1,1,"X");
      game.board.setMarker(2,1,"X");
      var spy = spyOn(window, 'alert');
      game.checkGameOver();
      expect(spy).toHaveBeenCalled();
    });

    it("declares a tie if there is no winner after 9 moves and ends the game", function(){
      game.board.setMarker(0,0,"O");game.board.setMarker(0,1,"X");game.board.setMarker(0,2,"O");
      game.board.setMarker(1,0,"X");game.board.setMarker(1,1,"X");game.board.setMarker(1,2,"O");
      game.board.setMarker(2,0,"X");game.board.setMarker(2,1,"O");game.board.setMarker(2,2,"X");
      var spy = spyOn(window, 'alert');
      game.checkGameOver();
      expect(spy).toHaveBeenCalled();
    });

    it("prevents new click events after the game is over", function(){
      game.board.setMarker(0,1,"X");
      game.board.setMarker(1,1,"X");
      game.board.setMarker(2,1,"X");
      spyOn(window, 'alert');
      game.checkGameOver();
      game.board.$el.find("tr:eq(2) td:eq(2)").trigger("click");
      expect(game.board.$el.find("tr:eq(2) td:eq(2)").html()).toEqual('');
    });
  });
});

describe("CPU", function(){
  var cpu;
  var game;

  beforeEach(function(){
    setUpHTMLFixture();  
    game = new Game($("#settings"), $("#board"));
    game.playerMarker = 'X'
    game.cpu = new CPU(game.playerMarker);
  });

  describe("#marker",function(){
    it("returns the opposite of the player marker", function(){
      expect(game.cpu.marker).toEqual('O');
    });
  });

  describe("#nextMove", function(){
    it("takes a corner if the cpu moves first", function(){
      game.playerTurn = 'last';
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 0, col: 0});
    });

    it("takes the center if the player moves in a corner first", function(){
      game.board.setMarker(0, 0, game.playerMarker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 1, col: 1});
    });    

    it("makes a winning move if it has two markers in a row", function(){
      game.board.setMarker(0, 1, game.cpu.marker);
      game.board.setMarker(2, 1, game.cpu.marker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 1, col: 1});
    });

    it("blocks the player from winning", function(){
      game.board.setMarker(0, 2, game.playerMarker);
      game.board.setMarker(2, 2, game.playerMarker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 1, col: 2});
    });

    it("looks to create a fork for two chances to win", function(){
      game.board.setMarker(0, 0, game.cpu.marker);
      game.board.setMarker(2, 2, game.cpu.marker);
      game.board.setMarker(1, 1, game.playerMarker);
      game.board.setMarker(2, 0, game.playerMarker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 0, col: 2});
    });

    it("blocks a player's possibility of a fork", function(){
      game.board.setMarker(0, 0, game.playerMarker);
      game.board.setMarker(2, 2, game.playerMarker);
      game.board.setMarker(1, 1, game.cpu.marker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 0, col: 1});
    });

    it("takes the center if it is open and if the above moves are unavailable", function(){
      game.board.setMarker(0, 0, game.playerMarker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 1, col: 1});
    });

    it("takes the opposite corner of a player marker if the above moves are unavailable", function(){
      game.board.setMarker(0, 0, game.playerMarker);
      game.board.setMarker(1, 1, game.cpu.marker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 2, col: 2});
    });

    it("takes any empty corner if the above moves are unavailable", function(){
      game.board.setMarker(0, 1, game.playerMarker);
      game.board.setMarker(1, 1, game.cpu.marker);
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 0, col: 0});
    });

    it("takes any empty side if the above moves are unavailable", function(){
      game.board.setMarker(0, 0, 'Y'); game.board.setMarker(0, 1, 'Y'); game.board.setMarker(0, 2, 'Y');
      game.board.setMarker(1, 0, 'Y'); game.board.setMarker(1, 1, 'Y'); game.board.setMarker(1, 2, 'Y');
      game.board.setMarker(2, 0, 'Y');game.board.setMarker(2, 2, 'Y');
      expect(game.cpu.nextMove(game.board, game)).toEqual({row: 2, col: 1});
    });    
  });
});

describe("Board", function(){
  var board;

  beforeEach(function() {
    setUpHTMLFixture();  
    board = new Board($("#board"));
  });

  it("accepts a jQuery element representing the game board.", function(){
    expect(board.$el).toEqual($("#board"));
  });

  describe("#setMarker", function(){
    it("sets a marker at a given row and col position", function(){
      board.setMarker(0, 0, 'X');
      expect(board.$el.find("tr:eq(0) td:eq(0)").html()).toEqual('X');
    });

    it("does not allow a marker to be placed if one exists there already", function(){
      board.setMarker(0, 0, 'X');
      board.setMarker(0, 0, 'O');
      expect(board.$el.find("tr:eq(0) td:eq(0)").html()).not.toEqual('O');
    });
  });

  describe("#checkWinner", function(){
    it("returns the marker if three markers of the same kind appear vertically", function(){
      board.setMarker(0,1,"X");
      board.setMarker(1,1,"X");
      board.setMarker(2,1,"X");
      expect(board.checkWinner()).toEqual('X');
    });

    it("returns the marker if three markers of the same kind appear horizontally", function(){
      board.setMarker(2,0,"X");
      board.setMarker(2,1,"X");
      board.setMarker(2,2,"X");
      expect(board.checkWinner()).toEqual('X');
    });

    it("returns the marker if three markers of the same kind appear diagonally", function(){
      board.setMarker(0,0,"X");
      board.setMarker(1,1,"X");
      board.setMarker(2,2,"X");
      expect(board.checkWinner()).toEqual('X');
    });
  });

  describe("#clearMarkers", function(){
    it("clears the board of all markers", function(){
      board.setMarker(1,1,"X");
      board.setMarker(2,2,"X");
      board.clearMarkers();
      expect(board.$el.find("tr:eq(1) td:eq(1)").html()).toEqual("");
      expect(board.$el.find("tr:eq(2) td:eq(2)").html()).toEqual("");
    });
  });

  describe("#spaceRemaining", function(){
    it("returns the number of open spaces on the board", function(){
      board.setMarker(1,1,"X");
      board.setMarker(2,2,"X");
      expect(board.spaceRemaining()).toEqual(7);
    });
  });

  describe("#getCell", function(){
    it("returns the marker, if any, at the given location", function(){
      board.setMarker(0,0,'X');
      expect(board.getCell(0,0)).toEqual('X');
    });
  });

  describe("#emptySpaces", function(){
    it("returns the empty spaces on the board", function(){
      board.setMarker(1,1,"X");
      board.setMarker(2,2,"X");
      expect(board.emptySpaces().length).toEqual(7);
    });
  })
});


function setUpHTMLFixture() {
  setFixtures('<table id="board">'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'</table>'
             +'<form id="settings">'
             +'   <input type="radio" name="marker" value="X">X'
             +'   <input type="radio" name="marker" value="O">O<br>'
             +'   <input type="radio" name="turn" value="first">First'
             +'   <input type="radio" name="turn" value="last">Last<br>'
             +'   <input type="submit" value="New Game">'
             +'</form>');
      
}